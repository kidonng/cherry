// ==UserScript==
// @name         HTTPS Everywhere
// @version      1.2.2
// @description  Redirect to HTTPS version if available
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*/*
// @match        https://*/*
// @exclude      http://localhost*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// ==/UserScript==

;(() => {
  const domains = GM_getValue('domains', {})

  if (location.protocol === 'https:') {
    if (domains[location.hostname] === false) {
      domains[location.hostname] = true
      GM_setValue('domains', domains)
    }

    return
  }

  const https = location.href.replace('http', 'https')

  switch (domains[location.hostname]) {
    case true:
      location.replace(https)
    case false:
      break
    default:
      domains[location.hostname] = false
      GM_setValue('domains', domains)

      fetch(https, { mode: 'no-cors' })
        .then(() => {
          location.replace(https)
        })
        .catch(() => {})
  }
})()
