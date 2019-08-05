// ==UserScript==
// @name         Wikiwand
// @version      1.0.2
// @description  Replace Wikiwand browser extension
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @include      https://*.wikipedia.org/*
// @include      https://www.wikiwand.com/*
// ==/UserScript==

if (location.host.includes('wikipedia.org') && !location.href.includes('oldformat=true')) {
  const path = location.pathname.substring(1, location.pathname.indexOf('/', 1))
  const lang = new URLSearchParams(location.search).get('variant') || (path === 'wiki' ? location.host.substring(0, location.host.indexOf('.')) : path)
  const hash = location.hash.replace('cite_note-', 'citenote')
  const title = location.pathname.includes('index.php') ? new URLSearchParams(location.search).get('title') : location.pathname.substring(location.pathname.indexOf('/', 1) + 1)
  location.href = `https://www.wikiwand.com/${lang}/${title}${hash}`
} else if (location.host === 'www.wikiwand.com' && location.hash && !location.hash.includes('.')) {
  setTimeout(() => document.querySelector(decodeURIComponent(location.hash.replace('/', ''))).scrollIntoView(), 0)
}
