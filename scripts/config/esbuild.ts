import {basename} from 'node:path'
import {readFileSync} from 'node:fs'
import {globbySync} from 'globby'
import type {BuildOptions} from 'esbuild'

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
	const file = readFileSync(path, 'utf8')
	const header = file.slice(0, file.indexOf(delimiter) + delimiter.length)
	return header
}

const root = (path: string) => `scripts/${path}`
const outdir = root('generated')
type Options = (script: string) => BuildOptions

const base: Options = (script) => ({
	entryPoints: [root(script)],
	bundle: true,
	minify: true,
	alias: {
		react: 'dom-chef',
	},
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
		...globbySync(root('*.ts{,x}')).map((file) => ({
			name: basename(file),
		})),
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
