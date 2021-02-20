// ==UserScript==
// @name         HTTPS Everywhere
// @version      1.1.1
// @description  Redirect to HTTPS version if available
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*
// @exclude      http://localhost*
// @exclude      http://127.0.0.1*
// @exclude      http://0.0.0.0*
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
