// ==UserScript==
// @name         Fix GitHub emoji on GNU/Linux
// @version      1.0.0
// @description  Force GitHub to use user preferred emoji on GNU/Linux
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @run-at       document-start
// ==/UserScript==

(() => {
  'use strict'

  Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('Linux', '') })
})()
