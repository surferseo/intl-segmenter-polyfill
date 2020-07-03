const { createIntlSegmenterPolyfill } = require('../dist/index.js')
const fs = require('fs')

const wasmBuffer = fs.readFileSync('../dist/break_iterator.wasm')
let wasmBinary = new Uint8Array(wasmBuffer)

;(async () => {
  const Segmenter = await createIntlSegmenterPolyfill(wasmBinary)
  const thai = fs.readFileSync('./thai.txt', 'utf-8')

  console.log(
    new Segmenter('th', { granularity: 'word' })
      .segment(thai)
      .filter(({ isWordLike }) => isWordLike),
  )

  const wiki = fs.readFileSync('./wikipedia.txt', 'utf-8')

  const hrstart = process.hrtime()

  new Segmenter('en', { granularity: 'word' })
    .segment(wiki)
    .filter(({ isWordLike }) => isWordLike)
    .forEach(({ segment }) => console.log(segment))
  // console.log(
  // )

  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
})()
