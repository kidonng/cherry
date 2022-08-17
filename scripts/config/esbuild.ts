import {expandGlobSync} from 'std/fs/mod.ts'
import type {BuildOptions, Plugin} from 'esbuild'
import {denoPlugin} from 'esbuild_deno_loader'

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
	const file = Deno.readTextFileSync(path)
	// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
	const header = file.slice(0, file.indexOf(delimiter) + delimiter.length)
	return header
}

const plugins: Plugin[] = [
	denoPlugin({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		importMapURL: new URL('../../import_map.json', import.meta.url),
	}),
]

const root = (path: string) => `scripts/${path}`
const outdir = root('generated')
type Options = (script: string) => BuildOptions

const base: Options = (script) => ({
	entryPoints: [root(script)],
	bundle: true,
	minify: true,
	plugins,
})

const userscript: Options = (script) => ({
	...base(script),
	outdir,
	banner: {
		js: getBanner(root(script)),
	},
	sourcemap: 'inline',
})

const bookmarklet: Options = (script) => ({
	...base(script),
	outdir,
	write: false,
	legalComments: 'none',
})

export const config: BuildOptions[] = [
	{
		...userscript('github-theme-switch.user.tsx'),
		// @github/catalyst relies on this
		keepNames: true,
	},
]
const scriptsWithConfig = new Set(
	config.map((i) => (i.entryPoints! as string[])[0]),
)
config.push(
	...[
		...expandGlobSync(root('*.ts{,x}')),
		{name: 'github-hide-public-badge.user.js'},
		{name: 'reposition-octotree-bookmark-icon.user.js'},
	]
		.filter((i) => !scriptsWithConfig.has(root(i.name)))
		.map((i) => userscript(i.name)),
)

export const bookmarkletConfig: BuildOptions[] = [
	{
		...bookmarklet('github-theme-switch.user.tsx'),
		// @github/catalyst relies on this
		keepNames: true,
	},
]
