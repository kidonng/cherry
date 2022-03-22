// ==UserScript==
// @name         GitHub Repository Avatars
// @version      1
// @description  Add avatars to GitHub repositories
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import { React } from './lib/dom-chef.ts'
;(() => {
    const icon = document.querySelector(
        '#repository-container-header .octicon-repo'
    )
    if (!icon) return

    const author = document.querySelector<HTMLElement>('[rel=author]')!
    const username = author.textContent
    const alt = `@${username}`
    const src =
        document.querySelector<HTMLImageElement>(`[alt="${alt}"]`)?.src ||
        `https://avatars.githubusercontent.com/${username}?size=48`

    const avatar = (
        <img
            className="avatar box-shadow-none mr-2"
            src={src}
            width="24"
            height="24"
            alt={alt}
        />
    )
    if (author.dataset.hovercardType === 'user')
        avatar.classList.add('avatar-user')
    icon.replaceWith(avatar)
})()
