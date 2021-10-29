const chokidar = require('chokidar')
const { build, config } = require('./esbuild')

console.log('Started watching')

for (const [scripts, options] of config) {
    chokidar.watch(scripts).on('change', function (path) {
        build([path], options)
    })
}
