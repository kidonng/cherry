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
  'github-hide-public-badge',
  'github-theme-switch',
  'reposition-octotree-bookmark-icon',
]

export default inputs.map((input) => {
  const full = `scripts/${input}.user.js`

  return {
    input: full,
    output: {
      banner() {
        const file = readFileSync(full, 'utf8')
        const header = file.substring(
          0,
          file.indexOf(delimiter) + delimiter.length
        )
        return header
      },
      dir: 'scripts/generated',
    },
    plugins,
  }
})
