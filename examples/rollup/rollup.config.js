import commonjs from '@rollup/plugin-commonjs'
import { wasm } from '@rollup/plugin-wasm'

export default {
  input: 'index.js',
  output: {
    file: 'out.js',
    format: 'iife',
  },
  plugins: [commonjs(), wasm()],
}
