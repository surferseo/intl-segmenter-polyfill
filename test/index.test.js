test('Bundled module', async () => {
  const Segmenter = await require('../dist/bundled.js').createIntlSegmenterPolyfill()
  const segments = new Segmenter('en', { granularity: 'word' }).segment(
    'foo bar'
  )
  expect(segments).toEqual([
    { breakType: 'word', index: 0, isWordLike: true, segment: 'foo' },
    { breakType: 'none', index: 3, isWordLike: false, segment: ' ' },
    { breakType: 'word', index: 4, isWordLike: true, segment: 'bar' },
  ])
})

test('FS loaded module', async () => {
  const fs = require('fs')
  const wasmBuffer = fs.readFileSync('./dist/break_iterator.wasm')
  const wasmBinary = new Uint8Array(wasmBuffer)

  const Segmenter = await require('../dist/index.js').createIntlSegmenterPolyfill(
    wasmBinary
  )
  const segments = new Segmenter('en', { granularity: 'word' }).segment(
    'foo bar'
  )
  expect(segments).toEqual([
    { breakType: 'word', index: 0, isWordLike: true, segment: 'foo' },
    { breakType: 'none', index: 3, isWordLike: false, segment: ' ' },
    { breakType: 'word', index: 4, isWordLike: true, segment: 'bar' },
  ])
})

test('Segments Thai words', async () => {
  const Segmenter = await require('../dist/bundled.js').createIntlSegmenterPolyfill()
  const segments = new Segmenter('en', { granularity: 'word' }).segment(
    'ยังมีอาสาสมัครน้อยมากเมื่อเทียบกับประชากรที่เข้าถึงอินเทอร์เน็ตได้'
  )
  expect(segments.map(({ segment }) => segment)).toEqual([
    'ยัง',
    'มี',
    'อาสา',
    'สมัคร',
    'น้อย',
    'มาก',
    'เมื่อ',
    'เทียบ',
    'กับ',
    'ประชากร',
    'ที่',
    'เข้า',
    'ถึง',
    'อินเทอร์เน็ต',
    'ได้',
  ])
})
