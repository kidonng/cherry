// ==UserScript==
// @name         GitHub conversation list avatars
// @version      1
// @description  Add avatars in GitHub's conversation list
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==

import React from 'dom-chef'
import { observe } from 'selector-observer'

const className = 'gcla-processed'

observe(
  `:is(.js-issue-row, .js-pinned-issue-list-item) [data-hovercard-type="user"]:not(.${className})`,
  {
    add(el) {
      el.classList.add(className)

      const username = el.textContent
      const size = 16

      el.prepend(
        <img
          className="avatar-user v-align-text-bottom"
          src={`https://avatars.githubusercontent.com/${username}?size=${
            size * devicePixelRatio
          }`}
          width={size}
        />,
        ' '
      )
    },
  }
)
