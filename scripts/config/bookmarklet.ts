import {build, stop} from 'esbuild'
import {bookmarkletConfig} from './esbuild.ts'

for (const options of bookmarkletConfig) {
	// eslint-disable-next-line no-await-in-loop
	const result = await build(options)
	const [{path, contents}] = result.outputFiles!
	// eslint-disable-next-line no-await-in-loop
	await Deno.writeTextFile(
		path,
		// eslint-disable-next-line no-script-url
		'javascript:' + new TextDecoder().decode(contents),
	)
}

stop()
