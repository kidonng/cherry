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
const root = 'scripts'
for (const script of [
  'github-hide-public-badge.user.js',
  'github-theme-switch.user.js',
  'reposition-octotree-bookmark-icon.user.js',
]) {
  const path = `${root}/${script}`

  esbuild.build({
    entryPoints: [path],
    outdir: `${root}/generated`,
    bundle: true,
    minify: true,
    banner: { js: getBanner(path) },
    plugins,
  })
}
