// ==UserScript==
// @name         HTTPS Everywhere
// @version      1.1.0
// @description  Redirect to HTTPS version if available
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*
// @run-at       document-start
// ==/UserScript==

;(() => {
  try {
    // Don't run in iframes
    if (window.self !== window.top) return

    const https = location.href.replace('http', 'https')
    fetch(https, { mode: 'no-cors' })
      .then(() => location.replace(https))
  } catch (e) {}
})()
