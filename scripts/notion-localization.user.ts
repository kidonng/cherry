// ==UserScript==
// @name         Notion Localization
// @version      3
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

    const { app_version, locale } = JSON.parse(info)
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
            alert(
                navigator.language === 'zh-CN'
                    ? `Notion ${app_version} 版本中文资源已下载，点击确定即可享受 ✨`
                    : `${locale} resources for Notion ${app_version} version has been downloaded, press OK to enjoy ✨`
            )
            location.pathname = '/'
        } catch (e) {
        } finally {
            return
        }
    }

    const script = document.createElement('script')
    script.id = 'messages'
    script.type = 'application/json'
    script.dataset['locale'] = 'en-US'
    script.innerHTML = messages

    document.documentElement.prepend(script)
})()
