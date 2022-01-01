const { basename, extname } = require('path')
const { writeFileSync } = require('fs')
const chalk = require('chalk')
const esbuild = require('esbuild')
const { plugins } = require('./esbuild')

for (const script of ['scripts/github-theme-switch.user.tsx']) {
    console.log(`Building ${chalk.bold(script)} as bookmarklet`)

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
            legalComments: 'none',
            plugins,
        })
        .then((result) => {
            for (const { path, contents } of result.outputFiles) {
                writeFileSync(
                    path,
                    'javascript:' + new TextDecoder().decode(contents)
                )
            }
        })
}
