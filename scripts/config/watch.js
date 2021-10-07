const chokidar = require('chokidar')
const chalk = require('chalk')
const { build, config } = require('./esbuild')

console.log('Watching started')

for (const [scripts, options] of config) {
  chokidar.watch(scripts).on('change', function (path) {
    console.log(
      `[${new Date().toLocaleTimeString()}] Building ${chalk.bold(path)}`
    )
    build([path], options)
  })
}
