import {dirname, extname} from 'std/path/mod.ts'
import {ensureDirSync} from 'std/fs/mod.ts'
import {build, stop} from 'esbuild'
import {bookmarkletConfig} from './esbuild.ts'

for (const options of bookmarkletConfig) {
	// eslint-disable-next-line no-await-in-loop
	const result = await build(options)
	const [{path, text}] = result.outputFiles!

	ensureDirSync(dirname(path))
	Deno.writeTextFileSync(
		path.replace(extname(path), '.bookmarklet.js'),
		`javascript:${text}`,
	)
}

stop()
