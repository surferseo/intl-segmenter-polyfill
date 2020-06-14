import babel from '@rollup/plugin-babel'
import wasm from '@rollup/plugin-wasm'

export default {
  input: 'src/bundled.js',
  output: {
    file: 'dist/bundled.js',
    format: 'umd',
    name: 'IntlSegmenterPolyfillBundled',
  },
  plugins: [wasm(), babel({ babelHelpers: 'runtime' })],
}
