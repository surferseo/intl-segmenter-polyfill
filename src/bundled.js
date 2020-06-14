import break_iterator from './break_iterator.wasm'
import { createIntlSegmenterPolyfillFromFactory } from './index'

export const createIntlSegmenterPolyfill = () => {
  return createIntlSegmenterPolyfillFromFactory(break_iterator)
}
