// ==UserScript==
// @name         Origin Finder
// @version      1.0.0
// @description  Redirect to resources' origin version
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://img.moegirl.org/*
// @run-at       document-start
// ==/UserScript==

;(() => {
  'use strict'

  const { hostname, pathname } = location

  switch (hostname) {
    case 'img.moegirl.org':
      if (pathname.endsWith('128.png')) {
        location.pathname = pathname.replace('128', 'original')
      }
      break
  }
})()
