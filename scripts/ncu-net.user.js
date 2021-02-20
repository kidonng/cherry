// ==UserScript==
// @name         NCU Net
// @version      2.1.1
// @description  NCU Campus Network Access Authentication System Helper
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://222.204.3.154/*
// @match        http://222.204.3.221:*/*
// @match        http://aaa.ncu.edu.cn:*/*
// ==/UserScript==

;(() => {
  const config = {
    // Available languages: en - English, zh - Simplified Chinese
    lang: 'zh',
    time: {
      // Recommend not too low, or mysterious Status Internal Server Error will trigger dirty alternative check
      checkInterval: 5000,

      // Recommend >= 10s (NCUWLAN needs a 10s break between two login)
      retryTimeout: 10000,
      autoLoginTimeout: 3000
    },
    log: {
      // Recommend not too high or the page can consume too much memory
      max: 50,
      info: 'black',
      processing: 'blue',
      success: 'green',
      error: 'red'
    }
  }

  const msg =
    config.lang === 'zh'
      ? {
          loaded: '加载成功',
          connecting: '正在连接',
          connectSuccess: '连接成功',
          connectFailed: `连接失败！${config.time.retryTimeout /
            1000} 秒后重试，点击注销按钮取消`,
          connectError: '连接异常！正在重新连接',
          logoutting: '正在注销',
          logoutSuccess: '注销成功',
          logoutFailed: '注销失败',
          statusError: '连接状态服务器失败！使用备用检测方式',
          offline: '网络已断开',
          online: '网络已连接',
          emptyField: '请输入帐号和密码'
        }
      : {
          loaded: 'Load success',
          connecting: 'Connecting',
          connectSuccess: 'Connect success',
          connectFailed: `Connect failed! Retry in ${config.time.retryTimeout /
            1000} sec(s), click logout button to cancel`,
          connectError: 'Connect error! Reconnecting',
          logoutting: 'Logoutting',
          logoutSuccess: 'Logout success',
          logoutFailed: 'Logout failed',
          statusError: 'Status server error! Use alternative check method',
          offline: 'Network is offline',
          online: 'Network is online',
          emptyField: 'Please enter your username and password'
        }

  const NCUXG = location.host === '222.204.3.154'
  const logBox = (NCUXG ? $('#notice') : $('.safety-tips'))
    .empty()
    .css({ height: '20rem', overflow: 'auto' })
  let timer = null

  const log = (color, msg) => {
    const now = new Date()
    if (logBox.children().length > config.log.max)
      logBox.children(':last').remove()
    logBox.prepend(
      `<div style="color: ${color}">${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${msg}</div>`
    )
  }

  if (NCUXG) {
    const ip = $('[name="user_ip"]').val()
    const ac_id = $('[name="ac_id"]').val()
    const enc_ver = 'srun_bx1'
    const n = 200
    const type = 1

    const connect = () => {
      log(config.log.processing, msg.connecting)

      const username = localStorage.username
      const password = localStorage.password

      $.get(
        '/cgi-bin/get_challenge',
        { username, ip },
        res => {
          const token = res.challenge
          const md5 = new Hashes.MD5().hex_hmac(token, password)
          const info = `{SRBX1}${new Hashes.Base64().encode(
            $.xEncode(
              JSON.stringify({ username, password, ip, acid: ac_id, enc_ver }),
              token
            )
          )}`

          $.get(
            '/cgi-bin/srun_portal',
            {
              action: 'login',
              username,
              password: `{MD5}${md5}`,
              ac_id,
              ip,
              n,
              type,
              info,
              chksum: new Hashes.SHA1().hex(
                [null, username, md5, ac_id, ip, n, type, info].join(token)
              )
            },
            res => {
              // E2620: Already connected
              if (res.res === 'ok' || res.ecode === 'E2620') {
                log(config.log.success, msg.connectSuccess)

                timer = setInterval(check, config.time.checkInterval)
              } else {
                log(config.log.error, msg.connectFailed)

                timer = setTimeout(connect, config.time.retryTimeout)
              }
            },
            'jsonp'
          )
        },
        'jsonp'
      )
    }

    const check = () =>
      $.get('/cgi-bin/rad_user_info', res => {
        if (res.includes('not_online')) {
          log(config.log.error, msg.connectError)

          clearInterval(timer)
          connect()
        }
      }).fail(() => {
        log(config.log.error, msg.statusError)

        clearInterval(timer)
        timer = setInterval(alternativeCheck, config.time.checkInterval)
      })

    const alternativeCheck = () =>
      $.get(
        `http://wx4.sinaimg.cn/large/0060lm7Tly1fz2yx9quplj300100107g?${Math.random()}`
      ).fail(() => {
        log(config.log.error, msg.connectError)

        clearInterval(timer)
        connect()
      })

    $('.dl').click(e => {
      e.preventDefault()

      if ($('[name="username"]').val() && $('[name="password"]').val()) {
        localStorage.username = `${$('[name="username"]').val()}${$(
          '[name="domain"]'
        ).val()}`
        localStorage.password = $('[name="password"]').val()

        connect()
      } else log(config.log.error, msg.emptyField)
    })

    $('.zx')
      .attr('onclick', null)
      .click(() => {
        log(config.log.processing, msg.logoutting)

        clearInterval(timer)
        $.getJSON(
          '/cgi-bin/srun_portal',
          { action: 'logout', username: localStorage.username, ip, ac_id },
          res => {
            if (res.res === 'ok') log(config.log.success, msg.logoutSuccess)
            else log(config.log.error, msg.logoutFailed)
          }
        )
      })

    ononline = () => {
      log(config.log.success, msg.online)

      connect()
    }

    if (localStorage.username && localStorage.password)
      timer = setTimeout(connect, config.time.autoLoginTimeout)
  } else {
    if (location.port !== '801')
      location.href = location.href.replace(/80[2-4]/, '801')

    const api = '/include/auth_action.php'
    const ac_id = $('[name="ac_id"]').val()
    const ajax = 1

    const connect = () => {
      log(config.log.processing, msg.connecting)

      const username = localStorage.username
      const password = localStorage.password

      $.post(
        api,
        {
          action: 'login',
          username,
          password: `{B}${base64encode(password)}`,
          ac_id,
          ajax
        },
        res => {
          // E2620: Already connected
          if (res.includes('login_ok') || res.ecode === 'E2620') {
            log(config.log.success, msg.connectSuccess)

            timer = setInterval(check, config.time.checkInterval)
          } else {
            log(config.log.error, msg.connectFailed)

            timer = setTimeout(connect, config.time.retryTimeout)
          }
        }
      )
    }

    const check = () =>
      $.post(api, { action: 'get_online_info' }, res => {
        if (res.includes('not_online')) {
          log(config.log.error, msg.connectError)

          clearInterval(timer)
          connect()
        }
      })

    $('[type="submit"]').click(e => {
      e.preventDefault()

      if ($('#loginname').val() && $('#password').val()) {
        localStorage.username = $('#loginname').val()
        localStorage.password = $('#password').val()

        connect()
      } else log(config.log.error, msg.emptyField)
    })

    $('#duankai')
      .attr('onclick', null)
      .click(() => {
        log(config.log.processing, msg.logoutting)

        clearInterval(timer)
        $.post(
          api,
          {
            action: 'logout',
            username: localStorage.username,
            password: localStorage.password,
            ajax
          },
          res => {
            if (res === '网络已断开')
              log(config.log.success, msg.logoutSuccess)
            else log(config.log.error, msg.logoutFailed)
          }
        )
      })

    ononline = () => {
      log(config.log.success, msg.online)

      connect()
    }

    if (localStorage.username && localStorage.password)
      timer = setTimeout(connect, config.time.autoLoginTimeout)
  }

  onoffline = () => {
    log(config.log.error, msg.offline)

    clearInterval(timer)
  }

  log(config.log.info, msg.loaded)
})()
