// ==UserScript==
// @name         Block Notion Analytics
// @version      2
// @description
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @match        https://*.notion.site/*
// @run-at       document-start
// ==/UserScript==

const json = (data = {}) => new Response(JSON.stringify(data))
const rawFetch = globalThis.fetch

// Eslint-disable-next-line capitalized-comments
// deno-lint-ignore require-await
globalThis.fetch = async (url, ...args) => {
	if (
		[
			'/api/v3/getUserAnalyticsSettings', // Segment (mostly)
			'https://exp.notion.so/v1/rgstr', // Statsig
			'https://http-inputs-notion.splunkcloud.com/services/collector/raw', // Splunk
		].includes(url as string)
	) {
		return json()
	}

	return rawFetch(url, ...args)
}

declare global {
	// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
	var __SENTRY__: unknown
}

globalThis.__SENTRY__ = {}
