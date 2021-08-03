// ==UserScript==
// @name         YouTube Screenshot
// @version      1.1.3
// @description  Screenshot for YouTube
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.youtube.com/*
// @noframes
// ==/UserScript==

;(() => {
  const $ = document.querySelector.bind(document)
  const svgNS = 'http://www.w3.org/2000/svg'

  document.head.insertAdjacentHTML(
    'beforeend',
    `
    <style>
      .screenshot-container {
        /* https://codepen.io/sdthornton/pen/wBZdXq */
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
        /* https://stackoverflow.com/a/50925544 */
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
      }

      .screenshot-container:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .screenshot-container img {
        width: 100%;
      }
    </style>`
  )

  let video
  const container = document.createElement('div')
  const a = document.createElement('a')
  const img = document.createElement('img')
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  container.classList.add('screenshot-container')
  container.hidden = true

  a.addEventListener('click', () => (container.hidden = true))

  img.title =
    'Click to save, use context menu to copy and more, press Esc to cancel'

  container.appendChild(a).appendChild(img)
  document.body.prepend(container)

  const screenshot = () => {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const image = canvas.toDataURL()
    const title = $('h1:not(.meta)').textContent
    const time = $('.ytp-time-current')
      .textContent.replace(/(\d+):(\d+):(\d+)/, '$1h$2m$3s')
      .replace(/(\d+):(\d+)/, '$1m$2s')
    const id = new URLSearchParams(location.search).get('v')
    const download = `${title} (${id} ${time})`

    a.download = download
    a.href = image
    img.src = image

    container.style.width = video.style.width
    container.style.height = video.style.height
    container.hidden = false
  }

  document.addEventListener('keypress', (e) => {
    if (
      document.activeElement.tagName !== 'INPUT' &&
      document.activeElement.tagName !== 'TEXTAREA' &&
      e.code === 'KeyS' &&
      container.hidden
    )
      screenshot()
  })

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && !container.hidden) container.hidden = true
  })

  // https://stackoverflow.com/a/54389066
  window.addEventListener(
    'yt-navigate-finish',
    () => {
      video = $('.html5-main-video')

      const path = document.createElementNS(svgNS, 'path')
      path.setAttribute('fill', '#fff')
      path.setAttribute(
        'd',
        'M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z'
      )

      const svg = document.createElementNS(svgNS, 'svg')
      svg.setAttribute('viewBox', '-8 -8 40 40')

      const button = document.createElement('button')
      button.classList.add('ytp-button')
      button.title = 'Screenshot (s)'
      button.addEventListener('click', screenshot)

      button.appendChild(svg).appendChild(path)
      $('.ytp-settings-button').after(button)
    },
    { once: true }
  )
})()
