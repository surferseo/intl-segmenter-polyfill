import createIntlSegmenterPolyfill from '../src/index.mjs'
import fs from 'fs'

const wasmBuffer = fs.readFileSync('../break_iterator.wasm')
let wasmBinary = new Uint8Array(wasmBuffer)

;(async () => {
  const mod = await createIntlSegmenterPolyfill(wasmBinary)
  const txt = fs.readFileSync('./thai.txt', 'utf-8')
  console.log(
    mod
      .run('xzclkjzxkcljlk', txt)
      .filter(([a, b, c]) => c === 200)
      .map(([a, b]) => txt.slice(a, b)),
  )
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const view = encoder.encode('ยังมีอาสาสมัค...asd asd')

  console.log(
    mod
      .run('th', 'ยังมีอาสาสมัค...asd asd')
      .filter(([a, b, c]) => c === 200)
      .map(([a, b]) => [a, b, decoder.decode(view.slice(a, b))]),
  )
})()
