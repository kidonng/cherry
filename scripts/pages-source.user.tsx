// ==UserScript==
// @name         Pages Source
// @version      9
// @description  Easily go to popular Git hosting services' source repository
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*.github.io/*
// @match        https://*.github.io/*
// @match        http://*.gitlab.io/*
// @match        https://*.gitlab.io/*
// @match        http://*.gitee.io/*
// @match        https://*.gitee.io/*
// @match        http://*.sourceforge.net/*
// @match        https://*.sourceforge.io/*
// @example      https://edwardtufte.github.io/
// @example      https://edwardtufte.github.io/tufte-css/
// @example      https://htyao.gitlab.io/
// @example      https://ipvb.gitee.io/
// @example      https://x1y9.gitee.io/gesture/help/background.html
// @example      http://grandperspectiv.sourceforge.net/
// @example      https://archgeotux.sourceforge.io/
// ==/UserScript==

import React from 'dom-chef'
import {css} from 'code-tag'

const id = 'cherry-pages-source'
const style = (
	<style>
		{css`
			#${id} {
				position: fixed;
				right: 0;
				bottom: 0;
				margin: 0.5rem;
				opacity: 0.5;
				transition: opacity 0.25s;
				/* Avoid unnecessary styling */
				text-decoration: none;
				text-shadow: none;
				background: none;
				border: none;
			}

			#${id}:hover {
				opacity: 1 !important;
			}
		`}
	</style>
)

const host = location.hostname.split('.')
const path = location.pathname.split('/')[1]
const size = 32

// Use negative index because GitLab allows usernames to contain a dot
// https://docs.gitlab.com/ee/user/project/pages/#security-for-gitlab-pages
const username = host[host.length - 3]
let href = ''
let title = ''
const icon = (<img width={size} height={size} />) as unknown as HTMLImageElement

switch (host[host.length - 2]) {
	case 'github':
		if (document.title === 'Site not found · GitHub Pages') break

		href = `https://github.com/${username}`
		title = 'Go to user profile'
		icon.src = 'https://api.iconify.design/logos/github-icon.svg'

		if (document.title === 'Page not found · GitHub Pages') break

		// Exclude paths beginning with 4 digits which are most likely to be YYYY
		// and prefer `username.github.io` as source repository
		href += path && !/^\d{4}/.test(path) ? `/${path}` : `/${username}.github.io`

		title = 'Go to source repository'
		break
	case 'gitlab':
		href = `https://gitlab.com/${username}/${path || `${username}.gitlab.io`}`
		title = 'Go to source repository'
		icon.src = 'https://api.iconify.design/logos/gitlab.svg'
		break
	case 'gitee':
		if (document.title === '404 Not Found') break

		href = `https://gitee.com/${username}/${path || username}`
		title = 'Go to source repository'
		icon.src =
			'https://api.iconify.design/simple-icons/gitee.svg?color=%23c71d23'
		style.append(css`
			#${id} {
				/* Fill center "G" */
				background: white;
				border-radius: 50%;
				/* Hide round crop artifact */
				border: 1px solid white;
			}
		`)
		break
	case 'sourceforge':
		href = `https://sourceforge.net/projects/${username}/`
		title = 'Go to source project'
		icon.src =
			'https://api.iconify.design/simple-icons/sourceforge.svg?color=%23f60'
		break
	default:
}

if (href) {
	document.head.append(style)
	document.body.append(
		<a href={href} id={id} title={title}>
			{icon}
		</a>,
	)
}
