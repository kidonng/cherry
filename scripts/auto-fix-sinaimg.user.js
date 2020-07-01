// ==UserScript==
// @name         Auto fix sinaimg
// @version      1.0.0
// @description  Auto fix loading of sinaimg.cn images
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http*://*/*
// ==/UserScript==

(() => {
  'use strict';

  document.addEventListener('error', ({ target }) => {
    if (target?.tagName === 'IMG' && target.src.includes('sinaimg.cn')) target.referrerPolicy = 'no-referrer'
  }, true)
})()
