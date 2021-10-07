const { basename, extname } = require('path')
const { writeFileSync } = require('fs')
const esbuild = require('esbuild')
const { plugins } = require('./esbuild')

for (const script of ['scripts/github-theme-switch.user.tsx']) {
  esbuild
    .build({
      entryPoints: [script],
      outfile: `scripts/generated/${basename(
        script,
        extname(script)
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
