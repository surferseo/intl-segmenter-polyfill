const createIntlSegmenterPolyfill = require('../dist/index.js').default
const fs = require('fs')

const wasmBuffer = fs.readFileSync('../dist/break_iterator.wasm')
let wasmBinary = new Uint8Array(wasmBuffer)

;(async () => {
  const encoder = new TextEncoder()
  const Segmenter = await createIntlSegmenterPolyfill(wasmBinary)

  const thai = fs.readFileSync('./thai.txt', 'utf-8')

  console.log(
    new Segmenter('th', { granularity: 'word' })
      .segment(thai)
      .filter(({ breakType }) => breakType === 'word'),
  )

  const wiki = fs.readFileSync('./wikipedia.txt', 'utf-8')
  view = encoder.encode(wiki)

  const hrstart = process.hrtime()

  console.log(
    new Segmenter('th', { granularity: 'word' })
      .segment(wiki)
      .filter(({ breakType }) => breakType === 'word'),
  )

  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
})()
