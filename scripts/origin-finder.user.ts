// ==UserScript==
// @name         Origin Finder
// @version      9
// @description  Redirect to resources' origin version
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// ==/UserScript==

;(async () => {
    const url = new URL(location.href)
    const { hostname, pathname } = url

    const redirects = [
        /*
         * GitHub - redirect github.com to github.io
         * Example: https://tingletech.github.com/moon-phase/
         * Example: https://forbeslindesay.github.com/express-route-tester/
         */
        [
            () =>
                hostname.endsWith('.github.com') &&
                // A note with link will show if there is a matching user
                // "Did you mean to visit <username>.github.io?"
                document.querySelector(
                    `a[href="//${hostname.replace('.com', '.io')}/" i]`
                ),
            () => ({ hostname: hostname.replace('.github.com', '.github.io') }),
        ],
        /*
         * Moegirlpedia - original size avatar
         * Example: https://img.moegirl.org.cn/common/avatars/1/128.png
         */
        [
            'img.moegirl.org.cn',
            () => ({
                pathname: pathname.replace(
                    /(\/common\/avatars\/\d+\/)128\.png/,
                    '$1original.png'
                ),
            }),
        ],
        /*
         * Dynasty Scans
         * Example: https://dynasty-scans.com/system/tag_contents_covers/000/004/136/medium/i166035.jpg (from https://dynasty-scans.com/series/4_koma_c)
         * Example: https://dynasty-scans.com/system/tag_contents_covers/000/008/619/thumb/00%20Volume%20cover.jpg (from https://dynasty-scans.com/series/1_x)
         */
        [
            'dynasty-scans.com',
            async () => {
                const re = /(tag_contents_covers\/(\d{3}\/){3})(medium|thumb)/
                const match = pathname.match(re)

                if (match) {
                    const original = pathname.replace(re, '$1original')

                    try {
                        const { ok } = await fetch(original, { method: 'HEAD' })

                        if (ok) return { pathname: original }
                        else if (match[3] === 'thumb')
                            return {
                                pathname: pathname.replace(re, '$1medium'),
                            }
                    } catch {}
                }
            },
        ],
        /*
         * Zhihu
         * Example: https://www2.zhihu.com/question/19581624
         */
        ['www2.zhihu.com', { hostname: 'www.zhihu.com' }],
        /*
         * Tieba
         * Example: https://wapp.baidu.com/mo/q/m?kw=百度
         * Example: https://wapp.baidu.com/m?kw=百度
         * Example: https://wapp.baidu.com/p/7320885912
         */
        [
            () =>
                [
                    'c.tieba.baidu.com',
                    'dq.tieba.com',
                    'jump2.bdimg.com',
                    'tieba.baidu.com',
                    'tiebac.baidu.com',
                    'wapp.baidu.com',
                    'wefan.baidu.com',
                ].includes(hostname),
            () => {
                // @ts-expect-error
                if (window.PageData?.user) window.PageData.user.is_login = true

                return {
                    hostname: 'tieba.baidu.com',
                    pathname: pathname.replace(/.*\/m/, '/f'),
                }
            },
        ],
        // Notification page on GitHub Gist is 404
        // https://github.com/github-community/community/discussions/19760
        [
            () =>
                hostname === 'gist.github.com' && pathname === '/notifications',
            { hostname: 'github.com' },
        ],
    ]

    for (const [condition, action] of redirects) {
        if (
            typeof condition === 'function'
                ? !condition()
                : hostname !== condition
        )
            continue

        const redirect = typeof action === 'function' ? await action() : action
        Object.assign(url, redirect)
        if (location.href !== url.href) location.assign(url.href)
    }
})()
