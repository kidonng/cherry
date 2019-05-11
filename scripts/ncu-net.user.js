// ==UserScript==
// @name         NCU Net
// @version      1.10.0
// @description  NCU Campus Network Access Authentication System Helper
// @author       kidonng
// @include      http://222.204.3.154/*
// @include      http://222.204.3.221/*
// @include      http://aaa.ncu.edu.cn/*
// ==/UserScript==

;(() => {
  const config = {
    // Configured account(s) will be used if given
    // NCU-5G/NCU-2.4G account
    NCUXG: {
      username: '',

      // ISPs: cmcc - 移动, unicom - 联通, ndcard - 电信, ncu - 校园网
      ISP: '',
      password: ''
    },

    // NCUWLAN account
    NCUWLAN: {
      username: '',
      password: ''
    },

    // Available languages: en - English, zh - Simplified Chinese
    lang: 'zh',

    // Recommend not too low, or mysterious Status Internal Server Error will trigger dirty alternative check
    checkInterval: 5000,

    // Recommend >= 10s (NCUWLAN needs a 10s break between two login)
    retryTimeout: 10000,
    log: {
      // Recommend not too high or the page can consume too much memory
      max: 50,
      info: '#000',
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
          connectFailed: `连接失败！${config.retryTimeout /
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
          connectFailed: `Connect failed! Retry in ${config.retryTimeout /
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

    let username = null

    const connect = () => {
      log(config.log.processing, msg.connecting)

      username =
        config.NCUXG.username && config.NCUXG.ISP
          ? `${config.NCUXG.username}@${config.NCUXG.ISP}`
          : `${$('[name="username"]').val()}${$('[name="domain"]').val()}`
      const password = config.NCUXG.password || $('[name="password"]').val()

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

                timer = setInterval(check, config.checkInterval)
              } else {
                log(config.log.error, msg.connectFailed)

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
          log(config.log.error, msg.connectError)

          clearInterval(timer)
          connect()
        }
      }).fail(() => {
        log(config.log.error, msg.statusError)

        clearInterval(timer)
        timer = setInterval(alternativeCheck, config.checkInterval)
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

      if (
        (config.NCUXG.username && config.NCUXG.ISP && config.NCUXG.password) ||
        ($('[name="username"]').val() && $('[name="password"]').val())
      ) {
        $('.dl').attr('disabled', true)
        $('.zx').removeAttr('disabled')

        connect()
      } else log(config.log.error, msg.emptyField)
    })

    $('.zx')
      .attr('onclick', null)
      .attr('disabled', true)
      .click(() => {
        log(config.log.processing, msg.logoutting)

        $('.zx').attr('disabled', true)

        clearInterval(timer)
        $.getJSON(
          '/cgi-bin/srun_portal',
          { action: 'logout', username, ip, ac_id },
          res => {
            if (res.res === 'ok') {
              log(config.log.success, msg.logoutSuccess)

              $('.dl').removeAttr('disabled')
            } else {
              log(config.log.error, msg.logoutFailed)

              $('.zx').removeAttr('disabled')
            }
          }
        )
      })

    ononline = () => {
      log(config.log.success, msg.online)

      connect()
    }
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
      log(config.log.processing, msg.connecting)

      username = config.NCUWLAN.username || $('#loginname').val()
      password = config.NCUWLAN.password || $('#password').val()

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

            timer = setInterval(check, config.checkInterval)
          } else {
            log(config.log.error, msg.connectFailed)

            timer = setTimeout(connect, config.retryTimeout)
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

      if (
        (config.NCUWLAN.username && config.NCUWLAN.password) ||
        ($('#loginname').val() && $('#password').val())
      ) {
        $('[type="submit"]').attr('disabled', true)
        $('#duankai').removeAttr('disabled')

        connect()
      } else log(config.log.error, msg.emptyField)
    })

    $('#duankai')
      .attr('onclick', null)
      .attr('disabled', true)
      .click(() => {
        log(config.log.processing, msg.logoutting)

        $('#duankai').attr('disabled', true)

        clearInterval(timer)
        $.post(api, { action: 'logout', username, password, ajax }, res => {
          if (res === '网络已断开') {
            log(config.log.success, msg.logoutSuccess)

            $('[type="submit"]').removeAttr('disabled')
          } else {
            log(config.log.error, msg.logoutFailed)

            $('#duankai').removeAttr('disabled')
          }
        })
      })

    ononline = () => {
      log(config.log.success, msg.online)

      connect()
    }
  }

  onoffline = () => {
    log(config.log.error, msg.offline)

    clearInterval(timer)
  }

  log(config.log.info, msg.loaded)
})()
