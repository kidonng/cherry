// ==UserScript==
// @name         Reposition Octotree bookmark icon
// @version      1.0.2
// @description  https://github.com/ovity/octotree/issues/992
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import { elementReady } from './lib/element-ready.ts'

// Divider
;(async () => {
  const icon = await elementReady('.gh-header-title .octotree-btn', {
    stopOnDomReady: false,
  })
  icon.parentElement.prepend(icon)
  icon.style.position = 'relative'
  icon.style.left = '-25px'
  icon.style.marginRight = '-25px'
})()
