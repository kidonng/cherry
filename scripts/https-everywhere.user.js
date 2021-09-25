// ==UserScript==
// @name         HTTPS Everywhere
// @version      3
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
  if (
    location.protocol === 'http:' &&
    location.hostname.endsWith('.github.io')
  ) {
    location.protocol = 'https:'
    return
  }

  const domains = await GM.getValue('domains', {})

  if (location.protocol === 'https:') {
    if (domains[location.hostname] === false) {
      domains[location.hostname] = true
      await GM.setValue('domains', domains)
    }

    return
  }

  if (location.hostname in domains) {
    if (domains[location.hostname]) location.protocol = 'https:'
    return
  }

  domains[location.hostname] = false
  await GM.setValue('domains', domains)

  fetch(location.href.replace('http', 'https'), { mode: 'no-cors' })
    .then(() => {
      location.protocol = 'https:'
    })
    .catch(() => {})
})()
