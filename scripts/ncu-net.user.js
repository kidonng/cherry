// ==UserScript==
// @name         NCU Net
// @version      3.0.0
// @description  A campus network helper for Nanchang University
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @include      http://222.204.3.154/*
// @include      http://222.204.3.221/*
// @include      http://aaa.ncu.edu.cn/*
// ==/UserScript==

;(() => {
  const config = {
    // Recommend not too low, or you may encounter "Status Internal Server Error"
    checkInterval: 5000,

    // Recommend >= 10s, NCUWLAN needs a 10s break between two login
    retryTimeout: 10000
  }

  const msg =
    navigator.language === 'zh-CN'
      ? {
          loaded: 'NCU Net 加载成功',
          connected: '连接成功',
          failed: `连接失败，${config.retryTimeout / 1000} 秒后重试`,
          error: '连接异常，正在重连',
          online: '网络已连接',
          offline: '网络已断开',
          ...zh_CN
        }
      : {
          loaded: 'Successfully loaded NCU Net',
          connected: 'Successfully connected',
          failed: `Failed to connect, retry in ${config.retryTimeout /
            1000} sec(s)`,
          error: 'Connection error, reconnecting',
          online: 'Network is online',
          offline: 'Network is offline',
          ...en_US
        }

  $('#notice-title, #notice-content').hide()
  const notice = $('.notice-heading')
    .after('<ul style="margin-top: 2rem; max-height: 30rem; overflow: auto">')
    .next()
  const log = (msg, color = 'black') => {
    if (notice.children().length > 100) notice.children(':last').remove()

    const now = new Date()
    notice.prepend(`
      <li style="color: ${color}">
        ${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${msg}
      </li>
    `)
  }

  const ac_id = $('#ac_id').val()
  const ip = $('#user_ip').val()
  const url = location.origin
  let timer

  const fields = ['username', 'password']
  if (location.host === '222.204.3.154') fields.push('domain')
  let account
  if (localStorage.account) {
    account = JSON.parse(localStorage.account)
    for (const field in account) $(`#${field}`).val(account[field])
  } else account = {}

  const login = () => {
    clearTimeout(timer)

    const params = { ...account, ac_id, ip }
    $.Login(url, params, ({ error, message }) => {
      if (error === 'ok') {
        log(msg.connected, 'green')
        timer = setTimeout(check, config.checkInterval)
        localStorage.account = JSON.stringify(account)
      } else {
        log(`${msg.failed} (${msg[message]})`, 'red')
        timer = setTimeout(login, config.retryTimeout)
      }
    })
  }

  const check = () => {
    $.Info(url, undefined, ({ error }) => {
      if (error === 'ok') timer = setTimeout(check, config.checkInterval)
      else {
        log(msg.error, 'red')
        login()
      }
    })
  }

  $('#login')
    .off('click')
    .click(() => {
      for (const field of fields) {
        const el = $(`#${field}`)

        if (el.val()) account[field] = el.val()
        else {
          el.focus()
          break
        }
      }

      if (Object.keys(account).length === fields.length) login()
    })

  window.addEventListener('online', () => {
    log(msg.online)
  })

  window.addEventListener('offline', () => {
    log(msg.offline)
    clearTimeout(timer)
  })

  log(msg.loaded)
})()
