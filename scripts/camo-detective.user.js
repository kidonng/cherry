// ==UserScript==
// @name         Camo Detective
// @version      1
// @description  Replace camo.githubusercontent.com image links on GitHub with [data-canonical-src]
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/anuraghazra/github-readme-stats#all-inbuilt-themes--
// ==/UserScript==

document
  .querySelectorAll('img[src^="https://camo.githubusercontent.com/"]')
  .forEach((image) => {
    const { parentElement } = image

    if (parentElement.href === image.src)
      parentElement.href = image.dataset.canonicalSrc
  })
