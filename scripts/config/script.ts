import {build, analyzeMetafile} from 'esbuild'
import {config} from './esbuild.js'

for (const options of config) {
	// eslint-disable-next-line no-await-in-loop
	const result = await build({...options, metafile: true})
	console.log(
		// eslint-disable-next-line no-await-in-loop
		await analyzeMetafile(result.metafile, {
			color: true,
		}),
	)
}
