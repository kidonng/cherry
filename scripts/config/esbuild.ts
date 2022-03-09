import { colors, esbuild, denoPlugin } from './deps.ts'

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
    const file = Deno.readTextFileSync(path)
    const header = file.slice(0, file.indexOf(delimiter) + delimiter.length)
    return header
}

const plugins = [denoPlugin()]

function build(script: string, options = {}) {
    console.log(
        `[${new Date().toLocaleTimeString()}] Building ${colors.bold(script)}`
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

const config: [string[], Record<string, unknown>][] = [
    [
        [
            'scripts/github-conversation-list-avatars.user.tsx',
            'scripts/github-hide-public-badge.user.js',
            'scripts/github-icon-tweaks.user.ts',
            'scripts/github-hovercards.user.ts',
            'scripts/notion-localization.user.tsx',
            'scripts/origin-finder.user.ts',
            'scripts/pages-source.user.tsx',
            'scripts/reposition-octotree-bookmark-icon.user.js',
            'scripts/telegram-raw-media.user.tsx',
        ],
        {},
    ],
    [['scripts/github-theme-switch.user.tsx'], { keepNames: true }],
]

export { plugins, build, config }
