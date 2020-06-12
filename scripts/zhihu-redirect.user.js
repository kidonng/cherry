// ==UserScript==
// @name         Zhihu Redirect
// @version      1.0.0
// @description  Redirect all variants of Tieba site to www.zhihu.com
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www2.zhihu.com/*
// @run-at       document-start
// ==/UserScript==

;(() => {
  'use strict'

  const { hostname } = location

  switch (hostname) {
    case 'www2.zhihu.com':
      location.hostname = 'www.zhihu.com'
      break
  }
})()
