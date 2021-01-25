// ==UserScript==
// @name         YouTube Mini Player
// @version      1.0.0
// @description  Floating YouTube mini player like Bilibili
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @include      https://www.youtube.com/*
// ==/UserScript==

;(() => {
  const $ = document.querySelector.bind(document)

  const scale = 0.5
  document.head.insertAdjacentHTML(
    'beforeend',
    `
    <style>
      #player:not(.skeleton) {
        z-index: 1000;
      }

      [data-mini-detached] #player:not(.skeleton) {
        position: fixed;
        right: -7.5vw;
        bottom: -10vh;
      }

      [data-mini-detached] video {
        cursor: move;
      }

      .mini-placeholder {
        display: none;
      }

      [data-mini-detached] .mini-placeholder {
        display: block;
      }
    </style>`
  )

  let initialized
  let header
  let container
  let player
  let video

  let lastClientX
  let lastClientY
  let lastTranslateX = 0
  let lastTranslateY = 0
  let translateX = 0
  let translateY = 0
  let moved

  const placeholder = document.createElement('div')
  placeholder.classList.add('mini-placeholder')

  const updateSize = () => {
    const { height, width } = video.style
    player.style.height = height
    player.style.width = width
    placeholder.style.height = height
    placeholder.style.width = width
  }

  const updateTransform = () => {
    player.style.transform = `scale(${scale}) translate(${
      translateX / scale
    }px, ${translateY / scale}px)`
  }

  const headerBottom = () => window.scrollY + header.offsetHeight
  const playerBottom = () =>
    container.offsetTop + Number(video.style.height.replace('px', ''))

  const observer = new MutationObserver((mutations) =>
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'style') updateSize()
    })
  )

  const scrollHandler = () => {
    if (
      headerBottom() >= playerBottom() &&
      !document.body.hasAttribute('data-mini-detached')
    ) {
      document.body.setAttribute('data-mini-detached', '')
      player.addEventListener('mousedown', mouseDownHandler)
      updateTransform()
    } else if (
      headerBottom() < playerBottom() &&
      document.body.hasAttribute('data-mini-detached')
    ) {
      document.body.removeAttribute('data-mini-detached')
      player.removeEventListener('mousedown', mouseDownHandler)
      player.style.transform = ''
    }
  }

  const mouseDownHandler = (e) => {
    lastClientX = e.clientX
    lastClientY = e.clientY

    window.addEventListener('mousemove', mouseMoveHandler)
    window.addEventListener(
      'mouseup',
      () => {
        lastTranslateX = translateX
        lastTranslateY = translateY

        window.removeEventListener('mousemove', mouseMoveHandler)
        if (moved) {
          moved = false
          video.click()
        }
      },
      { once: true }
    )
  }

  const mouseMoveHandler = (e) => {
    moved = true
    translateX = lastTranslateX + e.clientX - lastClientX
    translateY = lastTranslateY + e.clientY - lastClientY

    updateTransform()
  }

  // https://stackoverflow.com/a/54389066
  window.addEventListener('yt-navigate-finish', () => {
    if (!initialized) {
      header = $('#container.ytd-masthead')
      container = $('#primary-inner')
      player = $('#player:not(.skeleton)')
      video = $('.html5-main-video')

      updateSize()
      player.before(placeholder)
      observer.observe(video, { attributes: true })
    }

    if (
      !document.body.hasAttribute('data-mini-enabled') &&
      location.pathname === '/watch'
    ) {
      document.body.setAttribute('data-mini-enabled', '')
      window.addEventListener('scroll', scrollHandler, { passive: true })
    } else if (
      document.body.hasAttribute('data-mini-enabled') &&
      location.pathname !== '/watch'
    ) {
      document.body.removeAttribute('data-mini-enabled')
      window.removeEventListener('scroll', scrollHandler)

      if (document.body.hasAttribute('data-mini-detached'))
        document.body.removeAttribute('data-mini-detached')
    }
  })
})()
