// ==UserScript==
// @name         Origin Finder
// @version      6
// @description  Redirect to resources' origin version
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// ==/UserScript==

;(async () => {
    const url = new URL(location.href)
    const { hostname, pathname, searchParams } = url

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
         * Wikipedia - mobile to desktop
         * Example: https://zh.m.wikipedia.org/wiki/Wikipedia:首页
         */
        [
            () =>
                hostname.endsWith('.m.wikipedia.org') &&
                // @ts-expect-error
                !navigator.userAgentData?.mobile,
            () => ({
                hostname: hostname.replace(
                    '.m.wikipedia.org',
                    '.wikipedia.org'
                ),
            }),
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
         * Moegirlpedia - mobile to desktop
         * Example: https://mzh.moegirl.org.cn/Mainpage
         * Example: https://mzh.moegirl.org.cn/index.php?title=Mainpage&mobileaction=toggle_view_mobile
         */
        [
            () =>
                hostname === 'mzh.moegirl.org.cn' &&
                // @ts-expect-error
                !navigator.userAgentData?.mobile &&
                !searchParams.has('mobileaction'),
            { hostname: 'zh.moegirl.org.cn' },
        ],
        /*
         * Dynasty Scans
         * Example: https://dynasty-scans.com/system/tag_contents_covers/000/004/136/medium/i166035.jpg (from https://dynasty-scans.com/series/4_koma_c)
         * Example: https://dynasty-scans.com/system/tag_contents_covers/000/008/619/thumb/00%20Volume%20cover.jpg (from https://dynasty-scans.com/series/1_x)
         */
        [
            'dynasty-scans.com',
            () => {
                const re = /(tag_contents_covers\/(\d{3}\/){3})(medium|thumb)/
                const match = pathname.match(re)

                if (match) {
                    const original = pathname.replace(re, '$1original')
                    fetch(original, { method: 'HEAD' })
                        .then(({ ok }) => {
                            if (ok) {
                                url.pathname = original
                                location.assign(url.href)
                            } else if (match[3] === 'thumb') {
                                url.pathname = pathname.replace(re, '$1medium')
                                location.assign(url.href)
                            }
                        })
                        .catch(() => {})
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
        ['strongloop.com', { href: 'https://github.com/strongloop' }],
    ]

    for (const [condition, action] of redirects) {
        if (
            typeof condition === 'function'
                ? !condition()
                : hostname !== condition
        )
            continue

        const redirect = typeof action === 'function' ? action() : action
        Object.assign(url, redirect)
        if (location.href !== url.href) location.assign(url.href)
    }
})()
