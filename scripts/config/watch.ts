import { colors } from './deps.ts'
import { build, config } from './esbuild.ts'

console.log('Started watching')

for (const [scripts, options] of config) {
    for (const script of scripts) {
        build(script, {
            watch: {
                onRebuild() {
                    console.log(
                        `[${new Date().toLocaleTimeString()}] Building ${colors.bold(
                            script
                        )}`
                    )
                },
            },
            ...options,
        })
    }
}
