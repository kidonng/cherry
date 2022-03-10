import { colors, esbuild } from './deps.ts'
import { config } from './esbuild.ts'

console.log('Started watching')

for (const options of config) {
    const [script] = options.entryPoints as string[]
    esbuild.build({
        ...options,
        watch: {
            onRebuild() {
                console.log(
                    `[${new Date().toLocaleTimeString()}] Building ${colors.bold(
                        script
                    )}`
                )
            },
        },
    })
}

// No `esbuild.stop()` here since we have to Ctrl-C anyway
