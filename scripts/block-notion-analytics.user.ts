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

const rawFetch = window.fetch
// deno-lint-ignore require-await
window.fetch = async (...args) => {
    const url = args[0] as string

    if (url === `${api}/getUserAnalyticsSettings`) {
        return json({
            isAmplitudeEnabled: false,
            isIntercomEnabled: false,
            isSegmentEnabled: false,
        })
    } else if (
        [
            `${api}/identifySegmentWorkspace`,
            `${api}/trackSegmentEvent`,
        ].includes(url)
    ) {
        return json({})
    } else if (url === 'https://api.statsig.com/v1/rgstr') {
        return json({ success: true })
    }

    return rawFetch(...args)
}

Object.defineProperty(window, '__SENTRY__', {
    get() {
        return {
            hub: {
                isOlderThan() {},
                getScope() {},
                bindClient() {},
                configureScope() {},
            },
        }
    },
    set() {},
})
