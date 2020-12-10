// ==UserScript==
// @name         GitHub theme switch
// @version      1.0.1
// @description  Adds theme preferences switch to GitHub's profile dropdown.
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import doma from 'doma'
import elementReady from 'element-ready'

const getForm = async () => {
  const res = await fetch('https://github.com/settings/appearance')
  const html = await res.text()
  const dom = doma(html)
  const form = dom.querySelector('.js-color-mode-settings')

  form.classList.add('mt-1', 'ml-1')
  form.querySelector('.flex-column').classList.remove('flex-lg-row')

  for (const image of form.querySelectorAll('img')) {
    image.parentElement.style.border = 'none'
    image.parentElement.style.fontWeight = 'normal'
    image.remove()
  }

  for (const radio of form.querySelectorAll('.position-relative')) {
    radio.classList.remove('mb-4')
  }

  return form
}

;(async () => {
  const style = document.createElement('style')
  style.innerHTML = `
  .github-theme-switch:hover {
    color: var(--color-text-primary);
    background-color: var(--color-bg-overlay);
  }
  `
  document.head.appendChild(style)

  const span = document.createElement('span')
  span.setAttribute('role', 'menuitem')
  span.classList.add('dropdown-item', 'github-theme-switch')
  span.textContent = 'Theme preference'

  const item = await elementReady(
    '.dropdown-item[href="https://gist.github.com/mine"]',
    {
      stopOnDomReady: false,
    }
  )
  const form = await getForm()
  item.after(span, form)
})()
