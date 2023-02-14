// ==UserScript==
// @name         Restore Notion Updates tabs
// @version      2
// @description  Restore “All” and “Following” updates tab in Notion
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @run-at       document-start
// ==/UserScript==

const json = (data = {}) => new Response(JSON.stringify(data))
const rawFetch = globalThis.fetch

globalThis.fetch = async (url, options) => {
	if (url === '/api/v3/getActivityLog') {
		const body = JSON.parse(options!.body as string)
		delete body.navigableBlock
		options!.body = JSON.stringify(body)
	}

	if (url === 'https://exp.notion.so/v1/initialize') {
		const response = await rawFetch(url, options)
		const data = await response.json()
		// Hashed "notifs_remove_following_tab"
		data.feature_gates['kV1Z+fxPuB3RU8MBmr/wnXKofEMdxXmXkWw07RJe6L4='].value =
			false
		return json(data)
	}

	return rawFetch(url, options)
}
