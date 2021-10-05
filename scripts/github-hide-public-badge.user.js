// ==UserScript==
// @name         GitHub hide public badge
// @version      4
// @description  Hides "Public" repository badge or removes "Public" prefix
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

// Ported from https://github.com/refined-github/refined-github/pull/4770

import { observe } from 'selector-observer'

function upperCaseFirst(input) {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
}

document.head.insertAdjacentHTML(
  'beforeend',
  `<style>
    .rgh-ci-link .Label[hidden] + .commit-build-statuses {
      margin-left: 0;
    }
  </style>`
)

observe('.Label.Label--secondary', {
  add(badge) {
    const newText = badge.textContent.trim().replace(/^Public ?/, '')

    if (newText === '') {
      badge.hidden = true
    } else {
      badge.textContent = upperCaseFirst(newText)
    }
  },
})
