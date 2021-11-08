// ==UserScript==
// @name         GitHub Precise Counters
// @version      2
// @description  Show precise watch/star/fork counts on hover
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

for (const counter of document.querySelectorAll('.social-count')) {
    const { textContent } = counter
    const exactCount = counter.getAttribute('aria-label').match(/\d+/)[0]

    counter.addEventListener(
        'mouseenter',
        () => (counter.textContent = exactCount)
    )
    counter.addEventListener(
        'mouseleave',
        () => (counter.textContent = textContent)
    )
}
