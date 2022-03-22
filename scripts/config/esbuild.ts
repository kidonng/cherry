import { path, esbuild, denoPlugin } from './deps.ts'

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
    const file = Deno.readTextFileSync(path)
    const header = file.slice(0, file.indexOf(delimiter) + delimiter.length)
    return header
}

const plugins = [denoPlugin()]

type Options = (script: string) => esbuild.BuildOptions

const base: Options = (script) => ({
    entryPoints: [script],
    bundle: true,
    minify: true,
    plugins,
})

const userscript: Options = (script) => ({
    ...base(script),
    outdir: 'scripts/generated',
    banner: {
        js: getBanner(script),
    },
})

const bookmarklet: Options = (script) => ({
    ...base(script),
    outfile: `scripts/generated/${path.basename(
        script,
        path.extname(script)
    )}.bookmarklet.js`,
    write: false,
    legalComments: 'none',
})

export const config: esbuild.BuildOptions[] = [
    ...[
        'scripts/github-conversation-list-avatars.user.tsx',
        'scripts/github-hide-public-badge.user.js',
        'scripts/github-icon-tweaks.user.ts',
        'scripts/github-hovercards.user.ts',
        'scripts/github-repository-avatars.user.tsx',
        'scripts/notion-localization.user.tsx',
        'scripts/origin-finder.user.ts',
        'scripts/pages-source.user.tsx',
        'scripts/reposition-octotree-bookmark-icon.user.js',
        'scripts/telegram-raw-media.user.tsx',
    ].map((script) => userscript(script)),
    {
        ...userscript('scripts/github-theme-switch.user.tsx'),
        keepNames: true,
    },
]

export const bookmarkletConfig: esbuild.BuildOptions[] = [
    bookmarklet('scripts/github-theme-switch.user.tsx'),
]
