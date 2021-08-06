// ==UserScript==
// @name         HTTPS Everywhere
// @version      1.2.0
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

  if (domains[location.hostname] === false) {
    if (location.protocol === 'https:') {
      domains[location.hostname] = true
      GM_setValue('domains', domains)
    }

    return
  }

  try {
    const https = location.href.replace('http', 'https')
    fetch(https, { mode: 'no-cors' }).then(() => {
      GM_setValue('domains', { ...domains, [location.hostname]: false })
      location.replace(https)
    })
  } catch (e) {}
})()
