// ==UserScript==
// @name         GitHub Hovercards
// @version      11
// @description  Enable native hovercards for more GitHub links
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/npm/npm
// ==/UserScript==

import { observe } from 'selector-observer'
import * as detect from 'github-url-detection'

const { getRepositoryInfo } = detect.utils

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
            let { pathname } = link

            if (
                pathname === location.pathname ||
                (detect.isRepoRoot(link) &&
                    getRepositoryInfo(link)!.nameWithOwner ===
                        getRepositoryInfo()?.nameWithOwner) ||
                ![
                    detect.isRepoRoot,
                    detect.isConversation,
                    detect.isCommit,
                ].some((fn) => fn(link)) ||
                link.closest('.Popover-message')
            )
                return

            if (detect.isPRCommit(link))
                pathname = pathname.replace(/pull\/\d+\/commits/, 'commit')

            if (
                detect.isConversation(link) &&
                pathname.endsWith('/linked_closing_reference')
            )
                return fetch(pathname, { method: 'HEAD' }).then(({ url }) => {
                    link.href = url
                    link.dataset['hovercardUrl'] = `${url}/hovercard`
                    link.parentElement!.classList.remove('tooltipped')
                })

            link.dataset['hovercardUrl'] = `${pathname}/hovercard`
        },
    }
)
