// ==UserScript==
// @name         Notion Localization
// @version      5
// @description  Enable Notion's native localization for more languages
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @run-at       document-start
// ==/UserScript==

import React from 'dom-chef'
// eslint-disable-next-line import/no-unassigned-import
import type {} from '@kidonng/typed-json'
// eslint-disable-next-line import/newline-after-import
;(async () => {
	// - `window.CONFIG.version` may not be available at this point
	// - If `localStorage.ajs_user_traits` exists, the user is logged in and localization is available
	const info = localStorage.getItem('ajs_user_traits')
	if (!info) return

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const {app_version, locale, is_desktop, preferred_locale} = JSON.parse<{
		app_version: string
		locale: string
		is_desktop: boolean
		preferred_locale: string
	}>(info)
	const metaKey = 'i10n-meta'
	const messageKey = 'i10n-messages'

	if (localStorage.getItem(metaKey) === `${app_version}-${locale}`) {
		const init = () => {
			document.documentElement.prepend(
				<script
					id="messages"
					type="application/json"
					data-locale={preferred_locale}
				>
					{localStorage.getItem(messageKey)}
				</script>,
			)
		}

		if (is_desktop)
			document.addEventListener('readystatechange', init, {once: true})
		else init()

		return
	}

	try {
		const assetsResponse = await fetch('/api/v3/getAssetsJsonV2', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({hash: ''}),
		})
		const {localeHtml, version} = await assetsResponse.json()
		if (!(locale in localeHtml)) return
		const htmlUrl = localeHtml[locale]

		const htmlResponse = await fetch(htmlUrl)
		const html = await htmlResponse.text()
		const dom = new DOMParser().parseFromString(html, 'text/html')
		const {textContent} = dom.querySelector('#messages')!

		localStorage.setItem(metaKey, `${version}-${locale}`)
		localStorage.setItem(messageKey, textContent!)

		if (
			// eslint-disable-next-line no-alert
			confirm(
				'Notion Localization data updated successfully ✨, would you like to reload?',
			)
		)
			location.pathname = '/'
	} catch (error: unknown) {
		// eslint-disable-next-line no-alert
		alert(`Notion Localization data failed to update 😢\n\n${error}`)
	}
})()
