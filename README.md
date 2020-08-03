# Intl Segmenter Polyfill

[![npm version](https://badge.fury.io/js/intl-segmenter-polyfill.svg)](https://www.npmjs.com/package/intl-segmenter-polyfill)
![Build WASM](https://github.com/surferseo/intl-segmenter-polyfill/workflows/Build%20WASM/badge.svg)
![Test](https://github.com/surferseo/intl-segmenter-polyfill/workflows/Test/badge.svg)

Provides .wasm module built with icu4c for breaking text into words, so that we can polyfill [Intl Segmenter Proposal](https://github.com/tc39/proposal-intl-segmenter) with full compatibility, even on browsers that do not expose v8BreakIterator api.

**By default it bundles only Thai language dictionary. Modify `filters.json` if you need to support [other exotic languages](https://github.com/unicode-org/icu/tree/master/icu4c/source/data/brkitr/dictionaries).**

## Usage

```
npm install --save intl-segmenter-polyfill
```

### Web – fetch

This is the most efficient way as you can lazily load the wasm module only when you need it and use `instantiateStreaming` for the best performance. Serve `break_iterator.wasm` as a static asset with `application/wasm` content-type and you are good to go.

#### index.js

```js
import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill'
;(async function () {
  const Segmenter = await createIntlSegmenterPolyfill(
    fetch('/path/to/break_iterator.wasm'),
  )

  const segmenter = new Segmenter('en', { granularity: 'word' })
  const segments = segmenter.segment('foo bar baz')
})()
```

### Web – bundle with base64 encoded module

This is the simplest way to use the polyfill, at the cost of base64 encoded module – it's ~33% bigger and cannot be loaded on demand.

#### index.js

```js
import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill/bundled'
;(async function () {
  const Segmenter = await createIntlSegmenterPolyfill()
  const segmenter = new Segmenter('en', { granularity: 'word' })
  const segments = segmenter.segment('foo bar baz')
  console.log(segments)
})()
```

#### OR using plain old <script> in html

```html
<script src="bundled.js"></script>
<script>
  IntlSegmenterPolyfillBundled.createIntlSegmenterPolyfill().then(function (
    Segmenter,
  ) {
    const segmenter = new Segmenter('en', { granularity: 'word' })
    const segments = segmenter.segment('foo bar baz')
    console.log(segments)
  })
</script>
```

### Web – Rollup / Webpack wasm loader

@rollup/plugin-wasm and webpack wasm-loader can be used with `createIntlSegmenterPolyfillFromFactory`

#### rollup.config.js

```js
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
```

#### index.js

```js
import { createIntlSegmenterPolyfillFromFactory } from 'intl-segmenter-polyfill'
import break_iterator from 'intl-segmenter-polyfill/break_iterator.wasm'
;(async function () {
  const Segmenter = await createIntlSegmenterPolyfillFromFactory(break_iterator)

  const segmenter = new Segmenter('en', { granularity: 'word' })
  const segments = segmenter.segment('foo bar baz')
})()
```

### Node

```js
const {createIntlSegmenterPolyfill} = require('intl-segmenter-polyfill')
const fs = require('fs')

const wasmBuffer = fs.readFileSync('node_modules/intl-segmenter-polyfill/break_iterator.wasm')
let wasmBinary = new Uint8Array(wasmBuffer)

;(async () => {
  const Segmenter = await createIntlSegmenterPolyfill(wasmBinary);
  const segmenter = new Segmenter("en", { granularity: 'word' });
  const segments = segmenter.segment("foo bar baz");
)()
```

## Supported browsers

Besides Chrome, Firefox and Safari with reasonable versions, it polyfills TextEncoder/TextDecoder to support Edge 18 (non-chromium).

## Building

Running `./build.sh` while having docker installed should output `break_iterator.wasm` ready to be used in Node, browsers or Wasmer without a lot of special treatment (see examples above or `examples/`).
