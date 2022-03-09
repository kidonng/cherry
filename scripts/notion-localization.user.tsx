// ==UserScript==
// @name         Notion Localization
// @version      5
// @description  Enable Notion's native localization for more languages
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @run-at       document-start
// ==/UserScript==

import type {} from './lib/@types/web.ts'
import { React } from './lib/dom-chef.ts'
import { doma } from './lib/doma.ts'
;(async () => {
    // - `window.CONFIG.version` may not be available at this point
    // - If `localStorage.ajs_user_traits` exists, the user is logged in and localization is available
    const info = localStorage.getItem('ajs_user_traits')
    if (!info) return

    const { app_version, locale, is_desktop, preferred_locale } =
        JSON.parse(info)
    const metaKey = 'i10n-meta'
    const msgKey = 'i10n-messages'

    if (localStorage.getItem(metaKey) === `${app_version}-${locale}`) {
        const init = () =>
            document.documentElement.prepend(
                <script
                    id="messages"
                    type="application/json"
                    data-locale={preferred_locale}
                >
                    {localStorage.getItem(msgKey)}
                </script>
            )

        if (is_desktop)
            document.addEventListener('readystatechange', init, { once: true })
        else init()

        return
    }

    try {
        const assetsRes = await fetch('/api/v3/getAssetsJsonV2', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ hash: '' }),
        })
        const { localeHtml, version } = await assetsRes.json()
        if (!(locale in localeHtml)) return
        const htmlUrl = localeHtml[locale]

        const htmlRes = await fetch(htmlUrl)
        const html = await htmlRes.text()
        const dom = doma(html)
        const { textContent } = dom.querySelector('#messages')!

        localStorage.setItem(metaKey, `${version}-${locale}`)
        localStorage.setItem(msgKey, textContent!)

        if (
            confirm(
                'Notion Localization data updated successfully ✨, would you like to reload?'
            )
        )
            location.pathname = '/'
    } catch (e) {
        alert(`Notion Localization data failed to update 😢\n\n${e}`)
    }
})()
