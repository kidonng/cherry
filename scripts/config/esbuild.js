const { readFileSync } = require('fs')
const chalk = require('chalk')
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
        console.log(
            `[${new Date().toLocaleTimeString()}] Building ${chalk.bold(
                script
            )}`
        )

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
            'scripts/github-conversation-list-avatars.user.tsx',
            'scripts/github-hide-public-badge.user.js',
            'scripts/github-hovercards.user.ts',
            'scripts/notion-localization.user.tsx',
            'scripts/pages-source.user.tsx',
            'scripts/reposition-octotree-bookmark-icon.user.js',
            'scripts/telegram-raw-media.user.tsx',
        ],
    ],
]

module.exports = { plugins, build, config }
