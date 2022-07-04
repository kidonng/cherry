// ==UserScript==
// @name          Refined Danbooru
// @version       2
// @description   Make Danbooru great again
// @author        kidonng
// @namespace     https://github.com/kidonng/cherry
// @match         https://*.donmai.us/*
// @exclude-match https://cdn.donmai.us/*
// ==/UserScript==

import React from 'dom-chef'
import { install as hotkey } from '@github/hotkey'

const isSafebooru = location.hostname === 'safebooru.donmai.us'

const searchBoxSelector = '#tags, .one-line-form input.string'
// `esc` to clear search boxes
document.querySelectorAll<HTMLInputElement>(searchBoxSelector).forEach((e) => {
    e.type = 'search'
})
// `esc` to unfocus search boxes
document.addEventListener('keydown', (e) => {
    if (
        e.key === 'Escape' &&
        (e.target as HTMLElement).matches(searchBoxSelector) &&
        // Preserve the default behavior of <input type="search">
        (e.target as HTMLInputElement).value === ''
    )
        (document.activeElement as HTMLInputElement).blur()
})

// Use Gelbooru to search for more than 2 tags when Danbooru doesn't allow it
if (
    ['Member', 'Anonymous'].includes(
        document.body.dataset.currentUserLevelString!
    )
)
    document
        .querySelector('#search-box-form')
        ?.addEventListener('submit', (e) => {
            let value = (e.target as HTMLFormElement)
                .querySelector('input')!
                .value.trim()
            if (value.split(' ').length < 3) return

            e.preventDefault()
            const safe = 'rating:safe'
            if (isSafebooru && !value.includes(safe)) value += ` ${safe}`
            location.href = `https://gelbooru.com/index.php?page=post&s=list&tags=${value}`
        })

// Make post previews draggable
// Revert https://github.com/danbooru/danbooru/commit/349f8e098f51b4823959a72fa721aa1fa8f2a9c6
document
    .querySelectorAll<HTMLImageElement>('.post-preview-image')
    .forEach((e) => {
        e.draggable = true
    })

// Expandable tag list
const tagList = document.querySelector('#tag-list')
if (tagList) {
    document.head.append(
        <style>
            {`
            #sidebar summary :is(h2, h3) {
                display: inline-block;
            }
            `}
        </style>
    )

    const details = <details open />
    const summary = <summary />
    const h2 = <h2>Tags </h2>

    tagList.before(details)
    details.append(summary, tagList)
    summary.append(h2)

    // Group and count each type of tags
    let count = 0
    document.querySelectorAll('.categorized-tag-list h3').forEach((h3) => {
        const details = <details open />
        const summary = <summary />
        const list = h3.nextElementSibling!
        count += list.childElementCount

        h3.before(details)
        details.append(summary, list)
        summary.append(h3)
        h3.append(<span className="post-count">{list.childElementCount}</span>)
    })

    h2.append(<span className="post-count">{count}</span>)
}

// Alt + click to toggle tag in search box
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const tag = target.closest('.search-tag-list .search-tag')
    if (!tag || !e.altKey) return
    e.preventDefault()

    const input = document.querySelector<HTMLInputElement>('#tags')!
    const { value } = input
    const tagName = target.parentElement!.dataset.tagName!
    input.value = value.includes(tagName)
        ? value.replace(tagName, '').trim()
        : `${value.trim()} ${tagName}`
})

// Related Tags
// - Restore Meta/Shift click behavior of tag links
// - Alt + click to (de)select all tags in the same type
// Attach listener to `document.body` to receive the event earlier than Danbooru's native handler
document.body.addEventListener('click', (e) => {
    const tag = (e.target as HTMLElement).closest(
        '.simple-tag-list .search-tag'
    )
    if (!tag) return

    if (e.metaKey || e.shiftKey) e.stopImmediatePropagation()
    else if (e.altKey) {
        const self = tag.previousElementSibling as HTMLInputElement
        tag.closest('.simple-tag-list')!
            .querySelectorAll('input')
            .forEach((input) => {
                if (input !== self && input.checked === self.checked)
                    input.click()
            })
    }
})

if (isSafebooru) {
    // Show a different name
    document.querySelector('#app-name')!.textContent = 'Safebooru'

    // Link hidden post notice to current page/post
    const jumpLink = document.querySelector<HTMLAnchorElement>(
        ':is(.hidden-posts-notice, .image-container:not([data-rating="s"])) [href="https://danbooru.donmai.us"]'
    )
    if (jumpLink) jumpLink.pathname = location.pathname
}

// More keyboard shortcuts
// https://github.com/danbooru/danbooru/issues/5175
const renderShortcut = (name: string, shortcut: string) => (
    <li>
        {shortcut.split(' ').map((key) => (
            <>
                <kbd className="key">{key}</kbd>{' '}
            </>
        ))}
        {name}
    </li>
)
const renderShortcuts = (shortcuts: Record<string, string[]>) =>
    Object.entries(shortcuts).map(([name, [shortcut]]) =>
        renderShortcut(name, shortcut)
    )

const navShortcuts = {
    'Jump to My account/Login': ['j m', '#nav-my-account-link, #nav-login-link'],
    'Jump to Posts': ['j p', '#nav-posts-link'],
    'Jump to Comments': ['j c', '#nav-comments-link'],
    'Jump to Notes': ['j n', '#nav-notes-link'],
    'Jump to Artists': ['j r', '#nav-artists-link'],
    'Jump to Tags': ['j t', '#nav-tags-link'],
    'Jump to Pools': ['j o', '#nav-pools-link'],
    'Jump to Wiki': ['j w', '#nav-wiki-link'],
    'Jump to Forum': ['j f', '#nav-forum-link'],
}
const postShortcuts = {
    'Add post to pool': ['p', '#pool'],
    'Edit commentary': ['c', '#add-commentary'],
    'Show comments': ['esc', '#post-sections [href="#comments"]'],
}

for (const [key, selector] of [
    ...Object.values({
        ...navShortcuts,
        ...postShortcuts,
    }),
    // `q` to focus *every* search box
    ['q', '.one-line-form input.string'],
]) {
    const el = document.querySelector<HTMLElement>(selector)
    if (el) hotkey(el, key)
}

const shortcutPage = '/static/keyboard_shortcuts'
hotkey(<a href={shortcutPage} />, 'Shift+?')

if (location.pathname === shortcutPage) {
    document
        .querySelector('.column ul')!
        .append(
            ...renderShortcuts(navShortcuts),
            renderShortcut('Go to this page', '?')
        )
    document
        .querySelector('.column:nth-of-type(2) ul:nth-of-type(2)')!
        .append(...renderShortcuts(postShortcuts))
}
