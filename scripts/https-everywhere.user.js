// ==UserScript==
// @name         HTTPS Everywhere
// @version      1.1.2
// @description  Redirect to HTTPS version if available
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*
// @exclude      http://localhost*
// @run-at       document-start
// @noframes
// ==/UserScript==

;(() => {
  try {
    const https = location.href.replace('http', 'https')
    fetch(https, { mode: 'no-cors' })
      .then(() => location.replace(https))
  } catch (e) {}
})()
