import { build, config } from './esbuild.ts'
import { esbuild } from './deps.ts'

for (const [scripts, options] of config) {
    for (const script of scripts) {
        await build(script, options)
    }
}

esbuild.stop()
