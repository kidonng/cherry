// ==UserScript==
// @name         GitHub Repository Avatars
// @version      3
// @description  Add avatars to GitHub repositories
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import React from 'dom-chef'
// eslint-disable-next-line import/no-unassigned-import
import type {} from 'typed-query-selector'
import * as detect from 'github-url-detection'

const init = () => {
	// Icon for public but not template/fork/etc. repos
	const icon = document.querySelector(
		'#repository-container-header .octicon-repo',
	)
	if (!icon) return

	const username = detect.utils.getRepositoryInfo()!.owner
	const alt = `@${username}`
	const size = 24
	const src =
		document.querySelector(`img[alt="${alt}"]`)?.src ||
		`https://avatars.githubusercontent.com/${username}?size=${size * 2}`

	const avatar = (
		<img
			className="avatar mr-2"
			src={src}
			width={size}
			height={size}
			alt={alt}
		/>
	)
	if (!detect.isOrganizationRepo()) avatar.classList.add('avatar-user')
	icon.replaceWith(avatar)
}

addEventListener('turbo:render', init)
init()
