import { build, config } from './esbuild.ts'

for (const [scripts, options] of config) {
    for (const script of scripts) {
        build(script, options)
    }
}
