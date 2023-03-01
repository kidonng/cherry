import {dirname, extname} from 'node:path'
import {writeFileSync} from 'node:fs'
import {ensureDirSync} from 'fs-extra'
import {build} from 'esbuild'
import {bookmarkletConfig} from './esbuild.js'

for (const options of bookmarkletConfig) {
	// eslint-disable-next-line no-await-in-loop
	const result = await build(options)
	const {path, text} = result.outputFiles![0]!

	ensureDirSync(dirname(path))
	writeFileSync(
		path.replace(extname(path), '.bookmarklet.js'),
		`javascript:${text}`,
	)
}
