// ==UserScript==
// @name         Google Bang
// @version      2
// @description  Add support for !Bang Search Shortcuts to Google
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.google.com/*
// @run-at       document-start
// ==/UserScript==

const q = new URLSearchParams(location.search).get('q')
if (q?.startsWith('!') || q?.startsWith('\\'))
	location.replace(`https://duckduckgo.com/?q=${q}`)
