// polyfill TextEncoder and TextDecoder, which is missing on Edge 18
import 'fast-text-encoding'

const BREAK_TYPES = {
  grapheme: 0,
  word: 1,
  sentence: 3,
}

const getSegmentType = (type) => {
  if (type < 100) {
    return 'none'
  } else if (type >= 100 && type < 200) {
    return 'number'
  } else if (type >= 200 && type < 300) {
    return 'word'
  } else if (type >= 300 && type < 400) {
    return 'kana'
  } else if (type >= 400 && type < 500) {
    return 'ideo'
  }
}

const instantiateWasmModule = (wasm, imports) => {
  if (typeof wasm.then === 'function') {
    if (WebAssembly.instantiateStreaming != null) {
      return wasm.then((response) =>
        WebAssembly.instantiateStreaming(response, imports)
      )
    }

    return wasm
      .then((response) => response.arrayBuffer())
      .then((buffer) => WebAssembly.instantiate(buffer, imports))
  } else {
    return WebAssembly.instantiate(wasm, imports)
  }
}

const createIntlSegmenterPolyfillFromInstance = async (
  wasmInstance,
  values
) => {
  const allocStr = (str) => {
    const encoder = new TextEncoder()
    const view = encoder.encode(str + '\0')
    // typescript does not play well with webassembly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exports = wasmInstance.exports

    const ptr = exports.malloc(view.length)
    const memory = new Uint8Array(exports.memory.buffer, ptr, view.length)
    memory.set(view)
    return [ptr, view]
  }

  return class Segmenter {
    constructor(locale, options) {
      this.locale = locale
      this.options = options
    }

    segment(input) {
      const locale = this.locale
      const granularity = this.options.granularity
      const exports = wasmInstance.exports

      values.current = []
      const [inputPtr, inputView] = allocStr(input)
      const [localePtr] = allocStr(locale)
      exports.break_iterator(BREAK_TYPES[granularity], localePtr, inputPtr)

      exports.free(localePtr)
      exports.free(inputPtr)

      const decoder = new TextDecoder()

      return values.current.map(([start, end, segmentType]) => ({
        segment: decoder.decode(inputView.slice(start, end)),
        index: decoder.decode(inputView.slice(0, start)).length,
        isWordLike:
          granularity === 'word'
            ? getSegmentType(segmentType) !== 'none'
            : undefined,
        breakType:
          granularity === 'word' ? getSegmentType(segmentType) : undefined,
      }))
    }
  }
}

const getImports = (callback) => ({
  env: {
    push: (start, end, segmentType) => {
      callback([start, end, segmentType])
    },
    __sys_stat64: () => {},
  },
  wasi_snapshot_preview1: {
    proc_exit: () => {},
    fd_close: () => {},
    environ_sizes_get: () => {},
    environ_get: () => {},
  },
})

export const createIntlSegmenterPolyfillFromFactory = async (wasmFactory) => {
  let values = { current: [] }
  const { instance } = await wasmFactory(
    getImports((value) => {
      values.current.push(value)
    })
  )

  return createIntlSegmenterPolyfillFromInstance(instance, values)
}

export const createIntlSegmenterPolyfill = async (wasm) => {
  let values = { current: [] }

  const { instance } = await instantiateWasmModule(
    wasm,
    getImports((value) => {
      values.current.push(value)
    })
  )

  return createIntlSegmenterPolyfillFromInstance(instance, values)
}
