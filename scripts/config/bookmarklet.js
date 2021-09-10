import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const bookmarklet = () => ({
  renderChunk: (code) => `javascript:${code}`,
})

const plugins = [nodeResolve(), commonjs(), terser(), bookmarklet()]
const inputs = ['github-theme-switch']

export default inputs.map((input) => ({
  input: `scripts/${input}.user.js`,
  output: {
    format: 'iife',
    dir: 'scripts/generated',
    entryFileNames: '[name]-bookmarklet.js',
  },
  plugins,
}))
