import { readFileSync } from 'fs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const delimiter = '// ==/UserScript=='
const plugins = [
  nodeResolve(),
  commonjs(),
  terser({
    format: {
      comments: /^ (=|@)/,
    },
  }),
]
const inputs = [
  'scripts/reposition-octotree-bookmark-icon.user.js',
  'scripts/github-theme-switch.user.js',
]

export default inputs.map((input) => ({
  input,
  output: {
    banner() {
      const file = readFileSync(input, 'utf8')
      const header = file.substring(
        0,
        file.indexOf(delimiter) + delimiter.length
      )
      return header
    },
    dir: 'scripts/generated',
  },
  plugins,
}))
