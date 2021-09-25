// ==UserScript==
// @name         HTTPS Everywhere
// @version      1.2.5
// @description  Redirect to HTTPS version if available
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*/*
// @match        https://*/*
// @exclude      http://localhost*
// @run-at       document-start
// @grant        GM.getValue
// @grant        GM.setValue
// @noframes
// ==/UserScript==

;(async () => {
  // Exclude IPv4 hosts
  if (location.hostname.match(/^(\d+\.){3}\d+$/)) return

  const domains = await GM.getValue('domains', {})

  if (location.protocol === 'https:') {
    if (domains[location.hostname] === false) {
      domains[location.hostname] = true
      await GM.setValue('domains', domains)
    }

    return
  }

  const https = location.href.replace('http', 'https')

  if (location.hostname in domains) {
    if (domains[location.hostname]) location.replace(https)
    return
  }

  domains[location.hostname] = false
  await GM.setValue('domains', domains)

  fetch(https, { mode: 'no-cors' })
    .then(() => {
      location.replace(https)
    })
    .catch(() => {})
})()
