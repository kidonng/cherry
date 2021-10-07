const { readFileSync } = require('fs')
const esbuild = require('esbuild')
const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp')

const delimiter = '// ==/UserScript=='
function getBanner(path) {
  const file = readFileSync(path, 'utf8')
  const header = file.slice(0, file.indexOf(delimiter) + delimiter.length)
  return header
}

const plugins = [pnpPlugin()]

function build(scripts, options = {}) {
  for (const script of scripts) {
    esbuild.build({
      entryPoints: [script],
      outdir: 'scripts/generated',
      bundle: true,
      minify: true,
      banner: { js: getBanner(script) },
      plugins,
      ...options,
    })
  }
}

const config = [
  [
    [
      'scripts/github-hide-public-badge.user.js',
      'scripts/pages-source.user.tsx',
      'scripts/reposition-octotree-bookmark-icon.user.js',
    ],
  ],
  [['scripts/github-theme-switch.user.tsx'], { keepNames: true }],
]

module.exports = { plugins, build, config }
