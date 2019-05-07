// ==UserScript==
// @name         NCU Net
// @version      1.8.1
// @description  NCU Campus Network Access Authentication System Helper
// @author       kidonng
// @include      http://222.204.3.154/*
// @include      http://222.204.3.221/*
// @include      http://aaa.ncu.edu.cn/*
// ==/UserScript==

;(() => {
  const config = {
    // Available languages: en - English, zh - Simplified Chinese
    lang: 'zh',

    // Recommend not too low, or mysterious Status Internal Server Error will trigger dirty alternative check
    checkInterval: 5000,

    // Recommend >= 10s (NCUWLAN needs a 10s break between two logins)
    retryTimeout: 10000,

    // Recommend not too high or the page can consume too much memory
    maxLog: 50
  }

  const msg =
    config.lang === 'zh'
      ? {
          loaded: '加载成功',
          connecting: '正在连接',
          connectSuccess: '连接成功',
          connectFailed: `连接失败！${config.retryTimeout /
            1000} 秒后重试，点击注销按钮取消`,
          connectError: '连接异常！正在重新连接',
          logoutting: '正在注销',
          logoutSuccess: '注销成功',
          logoutFailed: '注销失败',
          statusError: '连接状态服务器失败！使用备用检测方式'
        }
      : {
          loaded: 'Load success',
          connecting: 'Connecting',
          connectSuccess: 'Connect success',
          connectFailed: `Connect failed! Retry in ${config.retryTimeout /
            1000} sec(s), click logout button to cancel`,
          connectError: 'Connect error! Reconnecting',
          logoutting: 'Logoutting',
          logoutSuccess: 'Logout success',
          logoutFailed: 'Logout failed',
          statusError: 'Status server error! Use alternative check method'
        }

  const NCUXG = location.host === '222.204.3.154'
  const logBox = (NCUXG ? $('#notice') : $('.safety-tips'))
    .empty()
    .css({ height: '20rem', overflow: 'auto' })
  let timer = null

  const log = (color, msg) => {
    const now = new Date()
    if (logBox.children().length > config.maxLog)
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

    let username = null

    const connect = () => {
      log('#2196f3', msg.connecting)

      username = `${$('[name="username"]').val()}${$('[name="domain"]').val()}`
      const password = $('[name="password"]').val()

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
                log('#4caf50', msg.connectSuccess)

                timer = setInterval(check, config.checkInterval)
              } else {
                log('#f44336', msg.connectFailed)

                timer = setTimeout(connect, config.retryTimeout)
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
          log('#f44336', msg.connectError)

          clearInterval(timer)
          connect()
        }
      }).fail(() => {
        log('#f44336', msg.statusError)

        clearInterval(timer)
        timer = setInterval(alternativeCheck, config.checkInterval)
      })

    const alternativeCheck = () =>
      $.get(
        `http://wx4.sinaimg.cn/large/0060lm7Tly1fz2yx9quplj300100107g?${Math.random()}`
      ).fail(() => {
        log('#f44336', msg.connectError)

        clearInterval(timer)
        connect()
      })

    $('.dl').click(e => {
      e.preventDefault()

      $('.dl').attr('disabled', true)
      $('.zx').removeAttr('disabled')

      connect()
    })

    $('.zx')
      .attr('onclick', null)
      .attr('disabled', true)
      .click(() => {
        log('#2196f3', msg.logoutting)

        $('.zx').attr('disabled', true)

        clearInterval(timer)
        $.getJSON(
          '/cgi-bin/srun_portal',
          { action: 'logout', username, ip, ac_id },
          res => {
            if (res.res === 'ok') {
              log('#4caf50', msg.logoutSuccess)

              $('.dl').removeAttr('disabled')
            } else {
              log('#f44336', msg.logoutFailed)

              $('.zx').removeAttr('disabled')
            }
          }
        )
      })
  } else {
    $(document.head).append(`
      <style>
        [disabled] {
          background:none !important;
        }
      </style>
    `)

    const api = '/include/auth_action.php'
    const ac_id = $('[name="ac_id"]').val()
    const ajax = 1

    let username = null
    let password = null

    const connect = () => {
      log('#2196f3', msg.connecting)

      username = $('#loginname').val()
      password = $('#password').val()

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
            log('#4caf50', msg.connectSuccess)

            timer = setInterval(check, config.checkInterval)
          } else {
            log('#f44336', msg.connectFailed)

            timer = setTimeout(connect, config.retryTimeout)
          }
        }
      )
    }

    const check = () =>
      $.post(api, { action: 'get_online_info' }, res => {
        if (res.includes('not_online')) {
          log('#f44336', msg.connectError)

          clearInterval(timer)
          connect()
        }
      })

    $('[type="submit"]').click(e => {
      e.preventDefault()

      $('[type="submit"]').attr('disabled', true)
      $('#duankai').removeAttr('disabled')

      connect()
    })

    $('#duankai')
      .attr('onclick', null)
      .attr('disabled', true)
      .click(() => {
        log('#2196f3', msg.logoutting)

        $('#duankai').attr('disabled', true)

        clearInterval(timer)
        $.post(api, { action: 'logout', username, password, ajax }, res => {
          if (res === '网络已断开') {
            log('#4caf50', msg.logoutSuccess)

            $('[type="submit"]').removeAttr('disabled')
          } else {
            log('#f44336', msg.logoutFailed)

            $('#duankai').removeAttr('disabled')
          }
        })
      })
  }

  log('#000', msg.loaded)
})()
