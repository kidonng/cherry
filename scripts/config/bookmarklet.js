const { basename, extname } = require('path')
const { writeFileSync } = require('fs')
const esbuild = require('esbuild')
const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp')

const plugins = [pnpPlugin()]
const root = 'scripts'
for (const script of ['github-theme-switch.user.js']) {
  const path = `${root}/${script}`

  esbuild
    .build({
      entryPoints: [path],
      outfile: `${root}/generated/${basename(
        path,
        extname(path)
      )}.bookmarklet.js`,
      bundle: true,
      minify: true,
      write: false,
      plugins,
    })
    .then((result) => {
      for (const { path, contents } of result.outputFiles) {
        writeFileSync(path, 'javascript:' + new TextDecoder().decode(contents))
      }
    })
}
