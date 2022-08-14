import {bold} from 'std/fmt/colors.ts'
import {build} from 'esbuild'
import {config} from './esbuild.ts'

console.log('Started watching')

for (const options of config) {
	const [script] = options.entryPoints as string[]
	build({
		...options,
		watch: {
			onRebuild() {
				console.log(
					`[${new Date().toLocaleTimeString()}] Building ${bold(script)}`,
				)
			},
		},
	})
}

// No `esbuild.stop()` here since we have to Ctrl-C anyway
