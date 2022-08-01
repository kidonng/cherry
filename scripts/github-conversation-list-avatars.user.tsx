// ==UserScript==
// @name         GitHub conversation list avatars
// @version      4
// @description  Add avatars in GitHub's conversation list
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import React from 'dom-chef'
// eslint-disable-next-line import/no-unassigned-import
import 'typed-query-selector'
import {observe} from 'selector-observer'

const className = 'gcla-processed'

// https://github.com/refined-github/refined-github/blob/82fb3d62f11838ad4120f510bd90520c57bb12da/source/features/highlight-collaborators-and-own-conversations.css#L4
document.head.append(
	<style>{`.${className}.rgh-collaborator { padding: 2px 5px 4px; }`}</style>,
)

observe(
	`:is(.js-issue-row, .js-pinned-issue-list-item) [data-hovercard-type="user"]:not(.${className})`,
	{
		add(element) {
			element.classList.add(className)

			const username = element.textContent
			const alt = `@${username}`
			const src =
				document.querySelector(`img[alt="${alt}"]`)?.src ||
				`https://avatars.githubusercontent.com/${username}?size=32`

			element.prepend(
				<img
					className="avatar avatar-user"
					src={src}
					width="16"
					height="16"
					alt={alt}
					loading="lazy"
					decoding="async"
				/>,
				' ',
			)
		},
	},
)
