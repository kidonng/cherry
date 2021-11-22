// ==UserScript==
// @name         GitHub Hovercards
// @version      5
// @description  Enable native hovercards for more GitHub links
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/npm/npm
// ==/UserScript==

import { observe } from 'selector-observer'
import * as detect from 'github-url-detection'

observe(
    `a:is([href^="/"], [href^="${location.origin}"]):not([data-hovercard-type], [data-pjax], .js-pjax-history-navigate, .js-navigation-open)`,
    {
        constructor: HTMLAnchorElement,
        add(link) {
            let { pathname } = link
            let type = ''

            if (detect.isRepoRoot(link)) type = 'repository'
            else if (detect.isCommit(link)) {
                type = 'commit'

                if (detect.isPRCommit(link))
                    pathname = pathname.replace(/pull\/\d+\/commits/, 'commit')
            } else if (detect.isIssue(link)) type = 'issue'
            else if (detect.isPRConversation(link)) type = 'pull_request'

            if (type) {
                link.dataset[
                    `${
                        type === 'issue' || type === 'pull_request'
                            ? 'issueAndPr'
                            : type
                    }HovercardsEnabled`
                ] = ''
                link.dataset['hovercardType'] = type
                link.dataset['hovercardUrl'] = `${pathname}/hovercard`
            }
        },
    }
)
