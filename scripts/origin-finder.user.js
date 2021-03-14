// ==UserScript==
// @name         Origin Finder
// @version      1.1.1
// @description  Redirect to resources' origin version
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://img.moegirl.org/*
// @match        https://dynasty-scans.com/*
// @match        https://www2.zhihu.com/*
// @match        http*://tieba.baidu.com/*
// @match        http*://wapp.baidu.com/*
// @match        http*://dq.tieba.com/*
// @match        http*://jump2.bdimg.com/*
// @match        http*://c.tieba.baidu.com/*
// @match        http*://wefan.baidu.com/*
// @match        http*://tiebac.baidu.com/*
// @match        https://mzh.moegirl.org.cn/*
// @run-at       document-start
// ==/UserScript==

;(async () => {
  'use strict'

  const { hostname, pathname, href, search } = location

  switch (hostname) {
    /* Moegirlpedia */
    case 'img.moegirl.org':
      if (pathname.endsWith('128.png'))
        location.pathname = pathname.replace('128', 'original')
      break
    /* Dynasty Scans */
    case 'dynasty-scans.com':
      const re = /(tag_contents_covers\/(\d{3}\/){3})(medium|thumb)/
      if (re.test(pathname)) {
        const url = pathname.replace(re, '$1original')
        const res = await fetch(url, { method: 'HEAD' })
        if (res.status === 200) location.pathname = url
      }
      break
    /* Zhihu */
    case 'www2.zhihu.com':
      location.hostname = 'www.zhihu.com'
      break
    /* Tieba */
    case 'tieba.baidu.com':
      if (pathname.startsWith('/mo')) {
        const params = new URLSearchParams(search.substring(1))
        const prefix = 'https://tieba.baidu.com/'
        if (params.get('word'))
          location.href = `${prefix}f?kw=${params.get('word')}`
        else if (params.get('kz'))
          location.href = `${prefix}p/${params.get('kz')}?pn=${
            Math.ceil(params.get('pn') / 30) + 1
          }`
      } else PageData.user.is_login = true
      break
    case 'dq.tieba.com':
    case 'jump2.bdimg.com':
    case 'c.tieba.baidu.com':
    case 'wefan.baidu.com':
    case 'tiebac.baidu.com':
      location.host = 'tieba.baidu.com'
      break
    case 'wapp.baidu.com':
      if (href.includes('/mo/q/m'))
        location.href = href.replace(
          'wapp.baidu.com/mo/q/m',
          'tieba.baidu.com/f'
        )
      break
    /* Moegirlpedia */
    case 'mzh.moegirl.org.cn':
      location.hostname = 'zh.moegirl.org.cn'
      break
  }
})()
