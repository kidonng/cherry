// ==UserScript==
// @name         GitHub icon tweaks
// @version      1
// @description  Tweak certain GitHub icons' color and style
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @example      https://github.com/refined-github/refined-github/issues/4976#event-5509778832
// @example      https://github.com/refined-github/refined-github/pull/4770#event-5278197585
// ==/UserScript==

import { observe } from 'selector-observer'
import * as octicons from '@primer/octicons'

observe('#discussion_bucket .TimelineItem-badge', {
    add(badge) {
        const isIssue = badge.closest('#show_issue')
        let icon: HTMLElement | null

        if (badge.querySelector('.octicon-issue-opened')) {
            badge.removeAttribute('style')
            if (!isIssue) badge.innerHTML = octicons['git-pull-request'].toSVG()
        } else if ((icon = badge.querySelector('.octicon-issue-closed'))) {
            badge.removeAttribute('style')

            if (isIssue) {
                badge.classList.replace(
                    'color-bg-danger-inverse',
                    'color-bg-done-emphasis'
                )
                icon.classList.add('color-fg-on-emphasis')
            } else badge.innerHTML = octicons['git-pull-request-closed'].toSVG()
        } else if (badge.querySelector('.octicon-git-pull-request-draft'))
            badge.classList.add(
                'color-bg-canvas-inverse',
                'color-fg-on-emphasis'
            )
    },
})
