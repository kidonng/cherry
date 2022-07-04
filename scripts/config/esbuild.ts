import * as fs from 'std/fs/mod.ts'
import * as path from 'std/path/mod.ts'
import * as esbuild from 'esbuild'
import { denoPlugin } from 'esbuild_deno_loader'

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
    const file = Deno.readTextFileSync(path)
    const header = file.slice(0, file.indexOf(delimiter) + delimiter.length)
    return header
}

const plugins = [
    denoPlugin({
        importMapURL: new URL('../../import_map.json', import.meta.url),
    }),
]

const root = 'scripts'
const outdir = `${root}/generated`
type Options = (script: string) => esbuild.BuildOptions

const base: Options = (script) => ({
    entryPoints: [`${root}/${script}`],
    bundle: true,
    plugins,
})

const userscript: Options = (script) => ({
    ...base(script),
    outdir,
    banner: {
        js: getBanner(`${root}/${script}`),
    },
})

const bookmarklet: Options = (script) => ({
    ...base(script),
    outfile: `${outdir}/${path.basename(
        script,
        path.extname(script)
    )}.bookmarklet.js`,
    minify: true,
    write: false,
    legalComments: 'none',
})

export const config: esbuild.BuildOptions[] = [
    {
        ...userscript('github-theme-switch.user.tsx'),
        // @github/catalyst relies on this
        keepNames: true,
    },
]
const scriptsWithConfig = config.map((i) => (i.entryPoints! as string[])[0])
config.push(
    ...[
        ...fs.expandGlobSync(`${root}/*.ts{,x}`),
        { name: 'github-hide-public-badge.user.js' },
        { name: 'reposition-octotree-bookmark-icon.user.js' },
    ]
        .filter((i) => !scriptsWithConfig.includes(`${root}/${i.name}`))
        .map((i) => userscript(i.name))
)

export const bookmarkletConfig: esbuild.BuildOptions[] = [
    {
        ...bookmarklet('github-theme-switch.user.tsx'),
        // @github/catalyst relies on this
        keepNames: true,
    },
]
