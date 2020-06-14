import wasm from '@rollup/plugin-wasm'

export default {
  input: 'src/bundled.js',
  output: {
    file: 'dist/bundled.js',
    format: 'umd',
    name: 'IntlSegmenterPolyfillBundled',
  },
  plugins: [
    wasm(),
  ],
}
