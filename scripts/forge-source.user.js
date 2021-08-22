// ==UserScript==
// @name         Forge Source
// @version      1.0.0
// @description  Easily go to SourceForge Project Web's source project
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*.sourceforge.net/*
// @match        https://*.sourceforge.io/*
// @example      http://grandperspectiv.sourceforge.net/
// @example      https://archgeotux.sourceforge.io/
// ==/UserScript==

;(() => {
  const id = 'cherry-forge-source'
  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>
    #${id} {
      position: fixed;
      right: 0;
      bottom: 0;
      margin: .5rem;
      opacity: .5;
      transition: opacity .25s;
    }

    #${id}:hover {
      opacity: 1;
    }
  </style>`
  )

  const project = location.hostname.replace(/\.sourceforge\.(net|io)/, '')
  const href = `https://sourceforge.net/projects/${project}/`
  const title = 'Go to source project'

  // Icon is from SourceForge header
  const icon =
    '<svg height="28" width="32" viewBox="0 0 117 102" version="1.1" aria-hidden="true"><g clip-path="url(#clip0)"><path d="M66.9 53.5C66.9 34.4 60.1 25.7 56.5 22.4C55.8 21.8 54.7 22.3 54.8 23.3C55.5 34.1 41.9 36.8 41.9 53.7V53.8C41.9 64.1 49.7 72.5 59.3 72.5C68.9 72.5 76.7 64.1 76.7 53.8V53.7C76.7 48.9 74.9 44.3 73.1 40.9C72.7 40.2 71.7 40.5 71.8 41.1C75.1 55.7 66.9 64.7 66.9 53.5Z" fill="black"/><path d="M46.2 93.8C45.8 93.8 45.3 93.6 45 93.3L0.499988 48.8C-0.100012 48.2 -0.100012 47.1 0.499988 46.4L47.5 -0.6C47.8 -0.8 48.2 -1 48.6 -1H62.1C62.9 -1 63.4 -0.5 63.6 0C63.8 0.5 63.8 1.2 63.2 1.8L19.1 46C18.2 46.9 18.2 48.3 19.1 49.2L54 84.2C54.6 84.8 54.6 85.9 54 86.6L47.3 93.4C47 93.6 46.6 93.8 46.2 93.8Z" fill="black"/><path d="M55.1 101.6C54.3 101.6 53.8 101.1 53.6 100.6C53.4 100.1 53.4 99.4 54 98.8L98.2 54.6C98.6 54.2 98.9 53.6 98.9 53C98.9 52.4 98.7 51.8 98.2 51.4L63.2 16.4C62.6 15.8 62.6 14.7 63.2 14L70 7.2C70.3 6.9 70.7 6.7 71.2 6.7C71.7 6.7 72 7 72.3 7.3L116.7 51.8C117 52.1 117.2 52.5 117.2 53C117.2 53.5 117 53.9 116.7 54.2L69.7 101.2C69.4 101.5 69 101.7 68.5 101.7H55.1V101.6Z" fill="black"/></g><defs><clipPath id="clip0"><rect width="653" height="102.6" fill="white" transform="translate(0 -1)"/></clipPath></defs></svg>'

  document.body.insertAdjacentHTML(
    'beforeend',
    `<a href="${href}" id="${id}" title="${title}">${icon}</a>`
  )
})()
