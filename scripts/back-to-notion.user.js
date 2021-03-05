// ==UserScript==
// @name         Back to Notion
// @version      1.0.0
// @description  Redirect custom Notion domains to www.notion.so
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @include      https://*
// @exclude      https://www.notion.so/*
// @run-at       document-start
// @noframes
// ==/UserScript==

;(() => {
  if (location.pathname.match(/[0-9a-f]{32}$/)) {
    const url = new URL(location)
    url.host = 'www.notion.so'
    location.replace(url.toString())
  }
})()

