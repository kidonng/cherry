// ==UserScript==
// @name         Notion Localization
// @version      4
// @description  Enable Notion's native localization for more languages
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @run-at       document-start
// ==/UserScript==

import doma from 'doma'
;(async () => {
    // - `window.CONFIG.version` may not be available at this point
    // - If `localStorage.ajs_user_traits` exists, the user is logged in and localization is available
    const info = localStorage.getItem('ajs_user_traits')
    if (!info) return

    const { app_version, locale, is_desktop } = JSON.parse(info)
    const key = `messages-${app_version}-${locale}`
    const messages = localStorage.getItem(key)

    if (!messages) {
        try {
            const assetsRes = await fetch('/api/v3/getAssetsJsonV2', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'notion-client-version': app_version,
                },
                body: JSON.stringify({ hash: '' }),
            })
            const { localeHtml } = await assetsRes.json()
            if (!(locale in localeHtml)) return
            const htmlUrl = localeHtml[locale]

            const htmlRes = await fetch(htmlUrl)
            const html = await htmlRes.text()
            const dom = doma(html)
            const { textContent } = dom.querySelector('#messages')!

            localStorage.setItem(key, textContent!)
            alert(`[Notion Localization]\n${locale} messages updated successfully ✨`)
            location.pathname = '/'
        } catch (e) {
            alert(`[Notion Localization]\n${locale} messages failed to update 😢`)
        } finally {
            return
        }
    }

    const init = () => {
        const script = document.createElement('script')
        script.id = 'messages'
        script.type = 'application/json'
        script.dataset['locale'] = 'en-US'
        script.innerHTML = messages
    
        document.documentElement.prepend(script)
    }

    if (is_desktop) document.addEventListener('readystatechange', init, { once: true })
    else init()
})()
