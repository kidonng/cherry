const { build, config } = require('./esbuild')

for (const [scripts, options] of config) build(scripts, options)
