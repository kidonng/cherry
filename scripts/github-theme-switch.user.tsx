// ==UserScript==
// @name         GitHub theme switch
// @version      5
// @description  Add theme preferences dropdown to GitHub header
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import React from 'dom-chef'
import 'typed-query-selector'
import {SyncIcon, SunIcon, MoonIcon} from '@primer/octicons-react'
import {AppearanceFormElement} from './vendor/github-appearance-form-element.ts'

declare global {
	namespace JSX {
		interface IntrinsicElements {
			// https://github.com/refined-github/refined-github/blob/90ad3b20c70681ca0ee85ef341e1818a887f9462/source/globals.d.ts#L42
			'details-menu': IntrinsicElements['div'] & {
				src?: string
				preload?: boolean
			}
		}
	}
}

const appearance = '/settings/appearance'
const label = 'Theme Preferences'

async function getForm() {
	const res = await fetch(appearance)
	const html = await res.text()
	const dom = new DOMParser().parseFromString(html, 'text/html')
	const form = dom.querySelector('appearance-form')!

	return form
}

function addDropdown(form: Element) {
	for (const img of form.querySelectorAll('img')) img.remove()

	const spinner = form.querySelector('.status-indicator-spinner')!
	spinner.classList.add('color-text-primary', 'v-align-text-bottom')

	const selectEl = form.querySelector('#color_mode_type_select')!
	selectEl.classList.replace('mr-2', 'my-2')

	const singlePanel = form.querySelector('div[data-mode-panel="single"]')!
	for (const radio of singlePanel.querySelectorAll(
		'[role="radiogroup"] > div',
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
		selectEl,
		singlePanel,
		autoPanel,
	)

	document.head.append(
		<style>
			{['auto', 'light', 'dark'].map(
				(mode) =>
					`[data-color-mode="${mode}"] .gts-${mode} { display: inline-block !important; }`,
			)}
		</style>,
	)

	const summary = (
		<summary
			className="Header-link"
			aria-label={label}
			aria-haspopup="menu"
			role="button"
		>
			<SyncIcon className="d-none gts-auto" />
			<SunIcon className="d-none gts-light" />
			<MoonIcon className="d-none gts-dark" />{' '}
			<span className="dropdown-caret" />
		</summary>
	)

	const dropdown = (
		<div className="Header-item position-relative d-none d-md-flex">
			<details className="details-overlay details-reset">
				{summary}
				<details-menu
					className="dropdown-menu dropdown-menu-sw pt-2"
					role="menu"
					style={{width: '180px', paddingLeft: '12px'}}
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

	const form = await getForm()
	addDropdown(form)
})()
