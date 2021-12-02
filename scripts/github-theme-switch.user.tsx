// ==UserScript==
// @name         GitHub theme switch
// @version      4
// @description  Add theme preferences dropdown to GitHub header
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @grant        GM.addStyle
// ==/UserScript==

import React from 'dom-chef'
import doma from 'doma'
import { sync, sun, moon } from '@primer/octicons'
import { AppearanceFormElement } from './vendor/github-appearance-form-element'

const appearance = '/settings/appearance'
const label = 'Theme Preferences'
const icons =
    sync.toSVG({ class: 'd-none gts-auto' }) +
    sun.toSVG({ class: 'd-none gts-light' }) +
    moon.toSVG({ class: 'd-none gts-dark' })

async function getForm() {
    const res = await fetch(appearance)
    const html = await res.text()
    const dom = doma(html)
    const form = dom.querySelector('appearance-form')!

    return form
}

async function addDropdown(form: Element) {
    for (const img of form.querySelectorAll('img')) img.remove()

    const spinner = form.querySelector('.status-indicator-spinner')!
    spinner.classList.add('color-text-primary', 'v-align-text-bottom')

    const select = form.querySelector('#color_mode_type_select')!
    select.classList.replace('mr-2', 'my-2')

    const singlePanel = form.querySelector('div[data-mode-panel="single"]')!
    for (const radio of singlePanel.querySelectorAll(
        '[role="radiogroup"] > div'
    )) {
        radio.classList.remove('col-md-4', 'col-6', 'mb-3')
        radio.classList.add('col-12', 'ml-n2')
    }
    for (const toggle of singlePanel.querySelectorAll('.hx_theme-toggle'))
        toggle.classList.add('border-0', 'text-normal')

    const autoPanel = form.querySelector('div[data-mode-panel="auto"]')!
    autoPanel.classList.add('d-none')

    const newForm = new AppearanceFormElement()
    newForm.append(
        <a className="text-bold Link--primary no-underline" href={appearance}>
            {label}
        </a>,
        spinner.parentElement!,
        select,
        singlePanel,
        autoPanel
    )

    GM.addStyle(
        ['auto', 'light', 'dark']
            .map(
                (mode) =>
                    `[data-color-mode="${mode}"] .gts-${mode} { display: inline-block !important; }`
            )
            .join('')
    )

    const summary = (
        <summary
            className="Header-link"
            aria-label={label}
            aria-haspopup="menu"
            role="button"
            dangerouslySetInnerHTML={{ __html: icons }}
        />
    )
    summary.append(' ', <span className="dropdown-caret" />)

    const dropdown = (
        <div className="Header-item position-relative d-none d-md-flex">
            <details className="details-overlay details-reset">
                {summary}
                <details-menu
                    class="dropdown-menu dropdown-menu-sw pt-2"
                    role="menu"
                    style={{ width: '180px', 'padding-left': '12px' }}
                >
                    {newForm}
                </details-menu>
            </details>
        </div>
    )

    document.querySelector('.Header-item--full')!.after(dropdown)
}

;(async () => {
    if (location.pathname === appearance) return

    getForm().then(addDropdown)
})()
