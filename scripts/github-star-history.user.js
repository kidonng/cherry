// ==UserScript==
// @name         GitHub Star history
// @version      1.0.0
// @description  Adds a button to Stargazers page to view star history on https://star-history.t9t.io/
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*/*/stargazers
// ==/UserScript==

(() => {
  const a = document.createElement('a')
  a.classList.add('btn', 'float-right', 'mt-n1')
  a.href = `https://star-history.t9t.io/#${location.pathname.split('/').slice(1, 3).join('/')}`

  const svgNS = 'http://www.w3.org/2000/svg'
  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute(
    'd',
    'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z'
  )
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('width', '16')
  svg.classList.add('octicon', 'octicon-star', 'mr-2')

  a.appendChild(svg).appendChild(path)
  svg.after('View star history')
  document.querySelector('#repos h2').after(a)
})()
