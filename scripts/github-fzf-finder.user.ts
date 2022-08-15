// ==UserScript==
// @name         GitHub fzf Finder
// @version      4
// @description  Power GitHub's "Go to file" feature with fzf
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import {Fzf, extendedMatch, type FzfResultItem, type Tiebreaker} from 'fzf'
import {isFileFinder} from 'github-url-detection'
import type MarkedTextElement from './vendor/marked-text-element.ts'
import type VirtualFilterInputElement from './vendor/virtual-filter-input-element.ts'
import type VirtualListElement from './vendor/virtual-list-element.ts'

// https://fzf.netlify.app/docs/latest#usage-making-it-behave-like-fzf-cli
const byTrimmedLengthAsc: Tiebreaker<string> = (a, b, selector) => {
	return selector(a.item).trim().length - selector(b.item).trim().length
}

function init() {
	if (!isFileFinder()) return

	const list = document.querySelector('.js-tree-finder')!
	const virtualFilter = list.querySelector<VirtualFilterInputElement<string>>(
		'.js-tree-finder-virtual-filter',
	)!
	const virtualList =
		list.querySelector<VirtualListElement<string>>('.js-tree-browser')!

	let fzf: Fzf<string[]>
	let results: FzfResultItem[]

	// 1. Replace filter
	virtualFilter.addEventListener(
		'virtual-filter-input-filtered',
		() => {
			// Only until first `virtual-filter-input-filtered` event fires
			// Would `virtualList` has values
			fzf = new Fzf(Array.from(virtualList.values()), {
				match: extendedMatch,
				tiebreakers: [byTrimmedLengthAsc],
			})

			let lastQuery: string
			virtualFilter.filterItems = function () {
				const query = this.input?.value.trim() ?? ''
				if (query === lastQuery) return
				lastQuery = query

				this.dispatchEvent(new CustomEvent('virtual-filter-input-filter'))

				this.filtered.clear()
				// eslint-disable-next-line unicorn/no-array-callback-reference
				results = fzf.find(query)
				for (const {item} of results) this.filtered.add(item)

				this.dispatchEvent(new CustomEvent('virtual-filter-input-filtered'))
			}
		},
		{once: true},
	)

	// 2. Replace sorter
	const sort = virtualList.sort.bind(virtualList)
	// Keep original order
	const compare = () => 0
	virtualList.sort = function () {
		sort(compare)
		return this
	}

	// 3. Replace highlighter
	virtualList.addEventListener('virtual-list-render-item', (event) => {
		if (!(event instanceof CustomEvent)) return

		const frag: DocumentFragment = event.detail.fragment
		const marker = frag.querySelector<MarkedTextElement>('marked-text')!

		let lastText: string
		let lastQuery: string
		marker.mark = function () {
			if (!results) return

			const text = this.textContent || ''
			const query = this.query
			if (text === lastText && query === lastQuery) return
			lastText = text
			lastQuery = query
			// Cheat it to call `this.#observer.disconnect()`
			this.disconnectedCallback()

			const result = results.find((result) => result.item === text)!
			const frag = document.createDocumentFragment()

			for (const [i, char] of Object.entries(text)) {
				if (result.positions.has(Number(i))) {
					const mark = document.createElement('mark')
					mark.textContent = char
					frag.append(mark)
				} else frag.append(char)
			}

			this.replaceChildren(frag)
		}
	})
}

init()
addEventListener('turbo:render', init)
