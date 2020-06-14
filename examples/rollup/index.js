import break_iterator from '../../dist/break_iterator.wasm'
import { createIntlSegmenterPolyfillFromFactory } from '../../dist/index'

;(async function () {
  const Segmenter = await createIntlSegmenterPolyfillFromFactory(break_iterator)

  const segmenter = new Segmenter('en', { granularity: 'word' })

  const updateSegmentList = (value) => {
    const segments = segmenter
      .segment(value)
      .map(
        ({ segment, isWordLike, breakType }) =>
          `${segment} – ${breakType} (isWordLike=${isWordLike})`
    )
    document.querySelector('ul').innerHTML = segments
      .map((segment) => `<li>${segment}</li>`)
      .join('\n')
  }

  document.querySelector('textarea').addEventListener('keyup', (e) => {
    updateSegmentList(e.currentTarget.value)
  })

  updateSegmentList(document.querySelector('textarea').value)
})()
