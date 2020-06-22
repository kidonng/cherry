// ==UserScript==
// @name         Origin Finder
// @version      1.0.1
// @description  Redirect to resources' origin version
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://img.moegirl.org/*
// @match        https://dynasty-scans.com/*
// @run-at       document-start
// ==/UserScript==

;(async () => {
  'use strict'

  const { hostname, pathname } = location

  switch (hostname) {
    case 'img.moegirl.org':
      if (pathname.endsWith('128.png'))
        location.pathname = pathname.replace('128', 'original')
      break
    case 'dynasty-scans.com':
      const re = /(tag_contents_covers\/(\d{3}\/){3})(medium|thumb)/
      if (re.test(pathname)) {
        const url = pathname.replace(re, '$1original')
        const res = await fetch(url, { method: 'HEAD' })
        if (res.status === 200) location.pathname = url
      }
      break
  }
})()
