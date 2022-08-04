// ==UserScript==
// @name         Block Notion Analytics
// @version      1
// @description
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @match        https://*.notion.site/*
// @run-at       document-start
// ==/UserScript==

const json = (data: unknown) => new Response(JSON.stringify(data))
// `window.CONFIG.api.http`
const api = '/api/v3'

const rawFetch = globalThis.fetch
// Eslint-disable-next-line capitalized-comments
// deno-lint-ignore require-await
globalThis.fetch = async (...args) => {
	const url = args[0] as string

	if (url === `${api}/getUserAnalyticsSettings`) {
		return json({
			isAmplitudeEnabled: false,
			isIntercomEnabled: false,
			isSegmentEnabled: false,
		})
	}

	if (
		[`${api}/identifySegmentWorkspace`, `${api}/trackSegmentEvent`].includes(
			url,
		)
	) {
		return json({})
	}

	if (url === 'https://api.statsig.com/v1/rgstr') {
		return json({success: true})
	}

	return rawFetch(...args)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
Object.defineProperty(window, '__SENTRY__', {
	get() {
		return {
			hub: {
				isOlderThan: noop,
				getScope: noop,
				bindClient: noop,
				configureScope: noop,
			},
		}
	},
	set: noop,
})
