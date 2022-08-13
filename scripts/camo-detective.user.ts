// ==UserScript==
// @name         Camo Detective
// @version      2
// @description  Replace camo.githubusercontent.com image links on GitHub with [data-canonical-src]
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/anuraghazra/github-readme-stats#all-inbuilt-themes--
// ==/UserScript==

// eslint-disable-next-line import/no-unassigned-import
import type {} from 'typed-query-selector'

const init = () => {
	for (const image of document.querySelectorAll(
		'img[src^="https://camo.githubusercontent.com/"]',
	)) {
		const link = image.parentElement as HTMLAnchorElement

		if (link.href === image.src) link.href = image.dataset.canonicalSrc!
	}
}

addEventListener('turbo:render', init)
init()
