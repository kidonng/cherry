// ==UserScript==
// @name         NCU Net
// @version      1.6.2
// @description  NCU Campus Network Access Authentication System Helper
// @author       kidonng
// @match        http://222.204.3.154/*
// @match        http://222.204.3.221/*
// @match        http://aaa.ncu.edu.cn/*
// ==/UserScript==

(() => {
  const config = {
    lang: 'zh',
    checkInterval: 3000,
    retryInterval: 10000,
    maxLog: 50
  }

  const msg =
    config.lang === 'zh'
      ? {
        loaded: '加载成功。',
        connecting: '正在连接……',
        connectSuccess: '连接成功。',
        connectFailed: `连接失败！${config.retryInterval /
        1000} 秒后重试，点击注销按钮取消。`,
        connectError: '连接异常！正在重新连接……',
        logouting: '正在注销……',
        logoutSuccess: '注销成功。',
        logoutFailed: '注销失败！'
      }
      : {
        loaded: 'Load success.',
        connecting: 'Connecting...',
        connectSuccess: 'Connect success.',
        connectFailed: `Connect failed! Retry in ${config.retryInterval /
        1000} sec(s), click logout button to cancel.`,
        connectError: 'Connect error! Reconnecting...',
        logouting: 'Logouting...',
        logoutSuccess: 'Logout success.',
        logoutFailed: 'Logout failed!'
      }

  const ncuxg = location.host === '222.204.3.154'
  const logBox = (ncuxg ? $('#notice') : $('.safety-tips')).empty().css({
    height: '300px',
    overflow: 'auto'
  })
  const log = (color, msg) => {
    const now = new Date()
    if (logBox.children().length > config.maxLog)
      logBox.children(':last').remove()
    logBox.prepend(
      `<div style="color: ${
        [null, '#4caf50', '#2196f3', '#f44336'][color]
      }">${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${msg}</span></div>`
    )
  }

  if (ncuxg) {
    const ip = $('[name="user_ip"]').val()
    const ac_id = $('[name="ac_id"]').val()
    const n = 200
    const type = 1
    let timer = null

    const connect = (
      username = $('[name="username"]').val() + $('[name="domain"]').val(),
      password = $('[name="password"]').val()
    ) => {
      log(0, msg.connecting)
      $.get(
        '/cgi-bin/get_challenge',
        {
          username,
          ip
        },
        res => {
          const token = res.challenge
          const md5 = new Hashes.MD5().hex_hmac(token, password)
          const info = `{SRBX1}${new Hashes.Base64().encode(
            $.xEncode(
              JSON.stringify({
                username,
                password,
                ip,
                acid: ac_id,
                enc_ver: 'srun_bx1'
              }),
              token
            )
          )}`

          $.get(
            '/cgi-bin/srun_portal',
            {
              action: 'login',
              username,
              password: `{MD5}${md5}`,
              ip,
              ac_id,
              info,
              chksum: new Hashes.SHA1().hex(
                [null, username, md5, ac_id, ip, n, type, info].join(token)
              ),
              n,
              type
            },
            res => {
              // E2620: Already connected
              if (res.res === 'ok' || res.ecode === 'E2620') {
                log(1, msg.connectSuccess)
                timer = setInterval(check, config.checkInterval)
              } else {
                log(3, msg.connectFailed)
                timer = setTimeout(connect, config.retryInterval)
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
        if (res.indexOf('not_online') === 0) {
          log(3, msg.connectError)
          clearInterval(timer)
          connect()
        }
      })

    $('.dl').click(e => {
      e.preventDefault()
      $('.dl').attr('disabled', true)
      $('.zx').removeAttr('disabled')
      connect()
    })
    $('.zx')
      .attr('disabled', true)
      .attr('onclick', null)
      .click(() => {
        log(0, msg.logouting)
        clearInterval(timer)
        $('.zx').attr('disabled', true)
        $('.dl').removeAttr('disabled')

        $.getJSON(
          '/cgi-bin/srun_portal',
          {
            action: 'logout',
            username: `${$('[name="username"]').val()}${$(
              '[name="domain"]'
            ).val()}`,
            ip,
            ac_id
          },
          res =>
            res.res === 'ok'
              ? log(1, msg.logoutSuccess)
              : log(3, msg.logoutFailed)
        )
      })
  } else {
    $(document.head).append(
      '<style>[disabled]{ background:none !important }</style>'
    )
    const api = '/include/auth_action.php'
    const ac_id = $('[name="ac_id"]').val()
    let timer = null

    const connect = () => {
      log(0, msg.connecting)
      $.post(
        api,
        {
          action: 'login',
          username: $('#loginname').val(),
          password: `{B}${base64encode($('#password').val())}`,
          ac_id,
          ajax: 1
        },
        res => {
          if (res.startsWith('login_ok') || res.ecode === 'E2620') {
            log(1, msg.connectSuccess)
            timer = setInterval(check, config.checkInterval)
          } else {
            log(3, msg.connectFailed)
            timer = setTimeout(connect, config.retryInterval)
          }
        }
      )
    }

    const check = () =>
      $.post(
        api,
        {
          action: 'get_online_info'
        },
        res => {
          if (res.startsWith('not_online')) {
            log(3, msg.connectError)
            clearInterval(timer)
            connect()
          }
        }
      )

    $('[type="submit"]').click(e => {
      e.preventDefault()
      $('[type="submit"]').attr('disabled', true)
      $('#duankai').removeAttr('disabled')
      connect()
    })
    $('#duankai')
      .attr('disabled', true)
      .attr('onclick', null)
      .click(() => {
        log(0, msg.logouting)
        clearInterval(timer)
        $('#duankai').attr('disabled', true)
        $('[type="submit"]').removeAttr('disabled')

        $.post(
          api,
          {
            action: 'logout',
            username: $('#loginname').val(),
            password: $('#password').val(),
            ajax: 1
          },
          res =>
            res === '网络已断开'
              ? log(1, msg.logoutSuccess)
              : log(3, msg.logoutFailed)
        )
      })
  }
  log(0, msg.loaded)
})()
