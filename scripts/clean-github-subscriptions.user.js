// ==UserScript==
// @name         Clean GitHub Subscriptions
// @version      1.0.0
// @description  Automatically unsubscribe from all closed/merged issues/PR
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/notifications/subscriptions*
// ==/UserScript==

;(() => {
  const $ = document.querySelector.bind(document)
  const $$ = document.querySelectorAll.bind(document)
  const clean = () => {
    const subscriptions = $$('.color-text-danger, .text-purple')

    if (subscriptions.length === 0) {
      const next = $('[data-hotkey="ArrowRight"]')
      if (next.disabled) alert('Subscriptions cleaned!')
      else next.click()
    } else {
      subscriptions.forEach((i) =>
        i.closest('.d-flex').querySelector('input').click()
      )
      $('[form="threads-unsubscribe-form"]').click()
    }
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState !== 'complete') return
    clean()
  })

  document.addEventListener('pjax:end', clean)
})()
