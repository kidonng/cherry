// ==UserScript==
// @name         Notion Medium Zoom
// @version      1
// @description  View images in Notion with Medium-style zoom
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @match        https://*.notion.site/*
// ==/UserScript==

import mediumZoom from 'medium-zoom'
import elementReady from 'element-ready'
import {css} from 'code-tag'
// eslint-disable-next-line import/no-unassigned-import
import type {} from 'typed-query-selector'

const imageBlockSelector = '.notion-image-block'
const imageSelector = `${imageBlockSelector} img`
const zoomImageSelector = '.medium-zoom-image'
const openImageSelector = `${zoomImageSelector}--opened`
const overlaySelector = '.medium-zoom-overlay'
const scrollerSelector = 'div.notion-scroller'

const style = document.createElement('style')
style.append(css`
	${overlaySelector},
	${openImageSelector} {
		/* Same as .notion-overlay-container to work with center peek */
		z-index: 999;
	}

	.notion-body.dark ${overlaySelector} {
		background-color: #191919 !important;
	}

	${imageSelector}:not(${zoomImageSelector}) {
		cursor: zoom-in;
	}
`)
document.head.append(style)

const zoom = mediumZoom.default()
const open = (target: HTMLElement) => {
	if (!target.matches(zoomImageSelector)) zoom.attach(target)
	void zoom.open({target})
}

// Notion's click listener is global when logged in, document when logged out
document.addEventListener('click', (event) => {
	const target = event.target as HTMLElement
	if (!target.matches(imageSelector)) return

	event.stopImmediatePropagation()
	open(target)
})

// Notion's key listener is global
document.addEventListener('keydown', (event) => {
	if (event.code !== 'Space') return

	const halo = document.querySelector(
		`${imageBlockSelector} .notion-selectable-halo`,
	)
	if (!halo) return

	event.stopImmediatePropagation()
	event.preventDefault()
	const target = halo.parentElement!.querySelector('img')!
	open(target)
})

// Passthrough scroll
zoom.on('open', async () => {
	// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
	const image = (await elementReady(openImageSelector, {
		stopOnDomReady: false,
	})) as HTMLElement
	const scroller =
		document.querySelector(`.notion-peek-renderer ${scrollerSelector}`) ??
		document.querySelector(`.notion-frame ${scrollerSelector}`)!

	// To-do: listen on zoom open
	image.addEventListener(
		'transitionend',
		() => {
			addEventListener('wheel', zoom.close, {once: true})
		},
		{once: true},
	)

	image.addEventListener('wheel', ({target, deltaY}) => {
		// To-do: the comparison should be looser
		if (
			// Scroll up at the top
			(scroller.scrollTop === 0 && deltaY < 0) ||
			// Scroll down at the bottom
			(scroller.scrollTop + scroller.offsetHeight === scroller.scrollHeight &&
				deltaY > 0)
		)
			return

		const {style} = target as HTMLImageElement
		const top = Number.parseInt(style.top, 10)
		style.top = `${top - deltaY}px`
		scroller.scrollBy(0, deltaY)
	})
})
