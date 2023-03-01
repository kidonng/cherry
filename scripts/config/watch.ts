import chalk from 'chalk'
import {context} from 'esbuild'
import {config} from './esbuild.js'

console.log('Started watching')

for (const options of config) {
	const [script] = options.entryPoints as string[]
	// eslint-disable-next-line no-await-in-loop
	const ctx = await context({
		...options,
		plugins: [
			{
				name: 'onRebuild',
				setup(build) {
					build.onEnd(() => {
						console.log(
							`[${new Date().toLocaleTimeString()}] Building ${chalk.bold(
								script,
							)}`,
						)
					})
				},
			},
		],
	})
	void ctx.watch()
}
