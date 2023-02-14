// ==UserScript==
// @name         Restore Notion Updates tabs
// @version      3
// @description  Restore “All” and “Following” updates tab in Notion
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @run-at       document-start
// ==/UserScript==

const rawFetch = globalThis.fetch
// Differentiate from page updates
const isUpdatesOpen = () => document.querySelector('.notion-updates-menu')

globalThis.fetch = async (url, options) => {
	if (url === '/api/v3/getActivityLog') {
		if (!isUpdatesOpen())
			// Wait for first render
			// This poses a small time tax on page updates
			await new Promise((resolve) => {
				setTimeout(resolve)
			})

		if (isUpdatesOpen()) {
			const body = JSON.parse(options!.body as string) as {
				navigableBlock: unknown
			}
			delete body.navigableBlock
			options!.body = JSON.stringify(body)
		}
	}

	if (url === 'https://exp.notion.so/v1/initialize') {
		const response = await rawFetch(url, options)
		const data = await response.json()
		// Hashed "notifs_remove_following_tab"
		data.feature_gates['kV1Z+fxPuB3RU8MBmr/wnXKofEMdxXmXkWw07RJe6L4='].value =
			false
		return new Response(JSON.stringify(data))
	}

	return rawFetch(url, options)
}
