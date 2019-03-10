// ==UserScript==
// @name         NCU Net
// @version      1.1.0
// @description  NCU Campus Network Access Authentication System Helper
// @author       kidonng
// @match        http://222.204.3.154/*
// @match        http://222.204.3.221/*
// @match        http://aaa.ncu.edu.cn/*
// @grant        none
// ==/UserScript==

;(() => {
  const ncuxg = location.host === '222.204.3.154'
  const logBox = (ncuxg ? $('#notice') : $('.safety-tips')).empty().css({
    height: '300px',
    overflow: 'auto'
  })
  const log = (color, msg) => {
    if (logBox.children().length > 50) logBox.children(':last').remove()
    logBox.prepend(
      `<div>${new Date().toTimeString().slice(0, 8)} <span style="color: ${
        ['#000', '#4caf50', '#2196f3', '#f44336'][color]
      }">${msg}</span></div>`
    )
  }

  if (ncuxg) {
    const ip = $('[name="user_ip"]').val()
    const ac_id = $('[name="ac_id"]').val()
    const n = 200
    const type = 1
    let timer = null

    const connect = (
      username = `${$('[name="username"]').val()}${$('[name="domain"]').val()}`,
      password = $('[name="password"]').val()
    ) =>
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
                `${token}${[username, md5, ac_id, ip, n, type, info].join(
                  token
                )}`
              ),
              n,
              type
            },
            res => {
              if (res.res === 'ok') {
                log(1, '连接成功')
                timer = setInterval(status, 3000)
              } else {
                log(3, '连接失败，10 秒后自动重连')
                timer = setTimeout(connect, 10000)
              }
            },
            'jsonp'
          )
        },
        'jsonp'
      )
    const status = () =>
      $.get('/cgi-bin/rad_user_info', res => {
        if (res.indexOf('not_online') === 0) {
          log(3, '连接异常，正在重新连接')
          clearInterval(timer)
          connect()
        }
      })

    $('.dl').click(e => {
      e.preventDefault()
      if (!timer) connect()
    })
    $('.zx')
      .attr('onclick', null)
      .click(e => {
        e.preventDefault()
        if (timer) {
          clearInterval(timer)
          timer = null
          $.getJSON('/cgi-bin/srun_portal', {
            action: 'logout',
            username: `${$('[name="username"]').val()}${$(
              '[name="domain"]'
            ).val()}`,
            ip,
            ac_id
          })
          log(2, '注销成功')
        }
      })
  } else {
    const api = '/include/auth_action.php'
    const ac_id = $('[name="ac_id"]').val()
    let timer = null

    const connect = () =>
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
          if (res.indexOf('login_ok') === 0) {
            log(1, '连接成功')
            timer = setInterval(status, 3000)
          } else {
            log(3, '连接失败，10 秒后自动重连')
            timer = setTimeout(connect, 10000)
          }
        }
      )
    const status = () =>
      $.post(
        api,
        {
          action: 'get_online_info'
        },
        res => {
          if (res.indexOf('not_online') === 0) {
            log(3, '连接异常，正在重新连接')
            clearInterval(timer)
            connect()
          }
        }
      )

    $('[type="submit"]').click(e => {
      e.preventDefault()
      if (!timer) connect()
    })
    $('#duankai')
      .attr('onclick', null)
      .click(() => {
        if (timer) {
          clearInterval(timer)
          timer = null
          $.post(api, {
            action: 'logout',
            username: $('#loginname').val(),
            password: $('#password').val(),
            ajax: 1
          })
          log(2, '注销成功')
        }
      })
  }
  log(0, '加载成功')
})()
