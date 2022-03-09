// ==UserScript==
// @name         GitHub icon tweaks
// @version      3
// @description  Tweak certain GitHub icons' color and style
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/refined-github/refined-github/issues/4976#event-5509778832
// @example      https://github.com/refined-github/refined-github/pull/4770#event-5278197585
// ==/UserScript==

import type {} from './lib/@types/web.ts'
import { observe } from './lib/selector-observer.ts'
import { octicons } from './lib/@primer/octicons.ts'

observe('.js-issues-results:not(#show_issue) .TimelineItem-badge', {
    add(badge) {
        if (badge.querySelector('.octicon-issue-opened')) {
            badge.innerHTML = octicons['git-pull-request'].toSVG()
        } else if (badge.querySelector('.octicon-issue-closed')) {
            badge.classList.replace(
                'color-bg-done-emphasis',
                'color-bg-danger-emphasis'
            )
            badge.innerHTML = octicons['git-pull-request-closed'].toSVG()
        } else if (badge.querySelector('.octicon-git-pull-request-draft'))
            badge.classList.add(
                'color-bg-canvas-inverse',
                'color-fg-on-emphasis'
            )
    },
})

observe(
    '[data-octo-click="profile_timeline_toggle_rollup_created_issues"] .State--closed',
    {
        add(badge) {
            badge.classList.add('color-bg-done-emphasis')
        },
    }
)
