// ==UserScript==
// @name         GitHub Hovercards
// @version      1
// @description  Enable native hovercards for more GitHub links
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/npm/npm
// ==/UserScript==

import { observe } from 'selector-observer'
import * as detect from 'github-url-detection'

// Other types of hovercards are enabled on most pages so don't bother to enable them
document
    .querySelector('.application-main')!
    .setAttribute('data-repository-hovercards-enabled', '')

observe(
    `a:is([href^="/"], [href^="${location.origin}"]):not([data-hovercard-type])`,
    {
        constructor: HTMLAnchorElement,
        add(link) {
            let { pathname } = link

            if (detect.isRepoRoot(link))
                link.setAttribute('data-hovercard-type', 'repository')
            else if (detect.isCommit(link)) {
                link.setAttribute('data-hovercard-type', 'commit')

                if (detect.isPRCommit(link))
                    pathname = pathname.replace(/pull\/\d+\/commits/, 'commit')
            } else if (detect.isIssue(link))
                link.setAttribute('data-hovercard-type', 'issue')
            else if (detect.isPRConversation(link))
                link.setAttribute('data-hovercard-type', 'pull_request')

            if (link.hasAttribute('data-hovercard-type'))
                link.setAttribute('data-hovercard-url', `${pathname}/hovercard`)
        },
    }
)
