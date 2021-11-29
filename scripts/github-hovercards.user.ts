// ==UserScript==
// @name         GitHub Hovercards
// @version      8
// @description  Enable native hovercards for more GitHub links
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/npm/npm
// ==/UserScript==

import { observe } from 'selector-observer'
import * as detect from 'github-url-detection'

observe(
    `a:is([href^="/"], [href^="${location.origin}"]):not(
        [data-hovercard-type],
        [data-pjax],
        .js-pjax-history-navigate,
        .js-navigation-open,
        [data-hydro-click*='"target":"PINNED_REPO"'],
        [data-hydro-click*='"click_target":"REPOSITORY"'],
        [itemprop="name codeRepository"]
    )`,
    {
        constructor: HTMLAnchorElement,
        add(link) {
            if (
                ![
                    detect.isRepoRoot,
                    detect.isConversation,
                    detect.isCommit,
                ].some((fn) => fn(link))
            )
                return

            let { pathname } = link

            if (
                detect.isConversation(link) &&
                pathname.endsWith('/linked_closing_reference')
            )
                return fetch(pathname, { method: 'HEAD' }).then(({ url }) => {
                    link.href = url
                    link.dataset['hovercardUrl'] = `${url}/hovercard`
                    link.parentElement!.classList.remove('tooltipped')
                })
            else if (detect.isPRCommit(link))
                pathname = pathname.replace(/pull\/\d+\/commits/, 'commit')

            link.dataset['hovercardUrl'] = `${pathname}/hovercard`
        },
    }
)
