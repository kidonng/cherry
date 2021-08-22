// ==UserScript==
// @name         GitHub Precise Counters
// @version      1.0.1
// @description  Show precise watch/star/fork counts on hover
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

;(() => {
  'use strict'

  const $ = document.querySelector.bind(document)
  const loggedIn = document.body.classList.contains('logged-in')
  const refinedGitHub = document.body.classList.contains(
    'rgh-hide-watch-and-fork-count'
  )

  const init = () => {
    const selectors = [[$('.social-count[href$="/watchers"]')]]

    if (loggedIn) {
      selectors.push(
        [$('.starred .social-count[href$="/stargazers"]')],
        [$('.unstarred .social-count[href$="/stargazers"]')]
      )
    } else {
      selectors.push([$('.social-count[href$="/stargazers"]')])
    }

    const forkCount = $('.social-count[href$="/network/members"]')
    if (refinedGitHub) {
      const forkIcon = document.querySelector(
        '.btn-with-count .octicon-repo-forked'
      )
      forkIcon.nextSibling.textContent = forkCount.textContent
      selectors.push([forkIcon.nextSibling, forkIcon.parentElement, forkCount])
    } else {
      selectors.push([forkCount])
    }

    for (const [target, trigger = target, source = target] of selectors) {
      if (!target) return

      const [preciseCount] = source.getAttribute('aria-label').split(' ')
      const roundedCount = target.textContent

      trigger.addEventListener(
        'mouseenter',
        () => (target.textContent = ` ${preciseCount}`)
      )
      trigger.addEventListener(
        'mouseleave',
        () => (target.textContent = roundedCount)
      )
    }
  }

  init()
  window.addEventListener('pjax:end', init)
})()
