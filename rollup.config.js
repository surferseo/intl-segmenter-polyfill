import babel from '@rollup/plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'IntlSegmenterPolyfill',
  },
  plugins: [babel({ babelHelpers: 'runtime' })],
}
