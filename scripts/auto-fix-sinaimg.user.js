// ==UserScript==
// @name         Auto fix sinaimg
// @version      3
// @description  Auto fix loading of sinaimg.cn images
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*/*
// @match        https://*/*
// ==/UserScript==

;(() => {
    const regex = /ws(\d)\.sinaimg\.cn/
    const replace = 'wx$1.sinaimg.cn'

    document.addEventListener(
        'error',
        async ({ target }) => {
            if (!target instanceof HTMLImageElement) return

            if (location.hostname === 'github.com') {
                const { canonicalSrc } = target.dataset
                if (!canonicalSrc?.match(regex)) return

                const res = await fetch('https://api.github.com/markdown', {
                    method: 'POST',
                    body: JSON.stringify({
                        text: `![](${canonicalSrc.replace(regex, replace)})`,
                    }),
                })
                const text = await res.text()
                const src = text.match(/src="(.+)" alt/)[1]
                target.src = src

                return
            }

            const { src } = target
            if (src.match(regex)) target.src = src.replace(regex, replace)
            target.referrerPolicy = 'no-referrer'
        },
        true
    )
})()
