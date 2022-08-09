import * as esbuild from 'esbuild'
import {config} from './esbuild.ts'

for (const options of config) {
	// eslint-disable-next-line no-await-in-loop
	const result = await esbuild.build({...options, metafile: true})
	console.log(
		// eslint-disable-next-line no-await-in-loop
		await esbuild.analyzeMetafile(result.metafile!, {
			color: true,
		}),
	)
}

esbuild.stop()
