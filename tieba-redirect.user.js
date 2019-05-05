// ==UserScript==
// @name         Tieba Redirect
// @version      1.0.1
// @description  Redirect all variants of Tieba site to tieba.baidu.com
// @author       kidonng
// @match        http://tieba.baidu.com/*
// @match        https://tieba.baidu.com/*
// @match        http://wapp.baidu.com/*
// @match        https://wapp.baidu.com/*
// @match        http://dq.tieba.com/*
// @match        https://dq.tieba.com/*
// @match        http://jump2.bdimg.com/*
// @match        https://jump2.bdimg.com/*
// @match        http://c.tieba.baidu.com/*
// @match        https://c.tieba.baidu.com/*
// ==/UserScript==

;(() => {
  if (location.host === 'tieba.baidu.com') {
    if (location.pathname.startsWith('/mo')) {
      const params = new URLSearchParams(location.search.substring(1))
      const prefix = 'https://tieba.baidu.com/'
      if (params.get('word'))
        location.href = `${prefix}f?kw=${params.get('word')}`
      else if (params.get('kz'))
        location.href = `${prefix}p/${params.get('kz')}?pn=${Math.ceil(
          params.get('pn') / 30
        ) + 1}`
    } else PageData.user.is_login = true
  } else if (
    location.host === 'dq.tieba.com' ||
    location.host === 'jump2.bdimg.com' ||
    location.host === 'c.tieba.baidu.com'
  )
    location.host = 'tieba.baidu.com'
  else if (location.href.includes('wapp.baidu.com/mo/q/m'))
    location.href = location.href.replace(
      'wapp.baidu.com/mo/q/m',
      'tieba.baidu.com/f'
    )
})()
