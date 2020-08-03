import babel from '@rollup/plugin-babel'
import wasm from '@rollup/plugin-wasm'

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/bundled.js',
  output: {
    file: 'dist/bundled.js',
    format: 'umd',
    name: 'IntlSegmenterPolyfillBundled',
  },
  plugins: [
    wasm(),
    babel({
      babelrc: false,
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            corejs: 3,
            modules: false,
            useBuiltIns: 'usage',
            targets: {
              ie: '11',
            },
          },
        ],
      ],
    }),
    resolve(),
    commonjs(),
  ],
}
