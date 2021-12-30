// ==UserScript==
// @name         GitHub Hovercards
// @version      17
// @description  Enable native hovercards for more GitHub links
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/npm/npm
// ==/UserScript==

import { observe } from 'selector-observer'
import * as detect from 'github-url-detection'

const { getRepositoryInfo } = detect.utils
// https://github.com/fregante/github-url-detection/pull/108
const isProfile = (source: HTMLAnchorElement) =>
    detect.isProfile(source) && !source.pathname.includes('.')

const userObserver = new MutationObserver(([mutation]) => {
    const target = mutation!.target as HTMLAnchorElement
    if (target.getAttribute('aria-label') !== 'Hovercard is unavailable') return

    target.removeAttribute('aria-label')
    target.classList.remove('tooltipped')
    target.dataset['hovercardUrl'] = target.dataset['hovercardUrl']!.replace(
        '/users',
        '/orgs'
    )
    target.dispatchEvent(
        new MouseEvent('mouseleave', { relatedTarget: target.parentElement })
    )
    // See `deactivateTimeout` in https://github.githubassets.com/assets/app/assets/modules/github/behaviors/hovercards.ts
    setTimeout(() => target.dispatchEvent(new MouseEvent('mouseover')), 100)
})

const issueObserver = new MutationObserver(([mutation]) => {
    const target = mutation!.target as HTMLAnchorElement
    if (target.getAttribute('aria-label') !== 'Hovercard is unavailable') return

    target.setAttribute('aria-label', 'Loading...')
    target.dispatchEvent(
        new MouseEvent('mouseleave', { relatedTarget: target.parentElement })
    )
    fetch(target.pathname, { method: 'HEAD' }).then(({ url }) => {
        target.href = url
        target.dataset['hovercardUrl'] = `${url}/hovercard`
        target.removeAttribute('aria-label')
        target.classList.remove('tooltipped')
        setTimeout(() => target.dispatchEvent(new MouseEvent('mouseover')), 100)
    })
})

observe(
    `a:is([href^="/"], [href^="${location.origin}"]):not(${[
        '[data-hovercard-url]', // Has hovercard
        '[data-pjax]', // PJAX link
        '.js-pjax-history-navigate', // PJAX link
        '.js-navigation-open', // PJAX link
        `[data-hydro-click*='"target":"PINNED_REPO"']`, // Has meta (pinned repo)
        `[data-hydro-click*='"click_context":"REPOSITORY_CARD","click_target":"REPOSITORY"']`, // Has meta (info card)
        `[data-hydro-click*='"event_type":"search_result.click"'][data-hydro-click*='"model_name":"Repository"']`, // Has meta (search results)
        '[itemprop="name codeRepository"]', // Has meta (list item)
    ].join()})`,
    {
        constructor: HTMLAnchorElement,
        add(link) {
            let { pathname } = link

            if (
                pathname === location.pathname ||
                (detect.isRepoTree(link) &&
                    getRepositoryInfo(link)!.nameWithOwner ===
                        getRepositoryInfo()?.nameWithOwner) ||
                ![detect.isConversation, detect.isCommit, isProfile].some(
                    (fn) => fn(link)
                ) ||
                link.closest(
                    [
                        '.Popover-message', // Inside hovercard
                        '.js-feature-preview-indicator-container', // Inside profile dropdown
                    ].join()
                )
            )
                return

            if (detect.isRepoTree(link))
                pathname = `/${getRepositoryInfo(link)!.nameWithOwner}`

            if (isProfile(link)) {
                pathname = `/users${pathname}`
                // Handle if the profile is for an organization
                userObserver.observe(link, { attributes: true })
            }

            if (detect.isPRCommit(link))
                pathname = pathname.replace(/pull\/\d+\/commits/, 'commit')

            if (detect.isConversation(link)) {
                if (pathname.endsWith('/linked_closing_reference'))
                    return fetch(pathname, { method: 'HEAD' }).then(
                        ({ url }) => {
                            link.href = url
                            link.dataset['hovercardUrl'] = `${url}/hovercard`
                            link.parentElement!.classList.remove('tooltipped')
                        }
                    )

                // Handle if the issue has been transferred
                if (detect.isIssue(link))
                    issueObserver.observe(link, { attributes: true })
            }

            link.dataset['hovercardUrl'] = `${pathname}/hovercard`
        },
    }
)
