const BREAK_TYPES = {
  grapheme: 0,
  word: 1,
}

const getSegmentType = (type: number) => {
  if (type < 100) {
    return 'none' as const
  } else if (type >= 100 && type < 200) {
    return 'number' as const
  } else if (type >= 200 && type < 300) {
    return 'word' as const
  } else if (type >= 300 && type < 400) {
    return 'kana' as const
  } else if (type >= 400 && type < 500) {
    return 'ideo' as const
  }
}

const instantiateWasmModule = (wasm, imports) => {
  if (typeof wasm.then === 'function') {
    if (WebAssembly.instantiateStreaming != null) {
      return WebAssembly.instantiateStreaming(wasm, imports)
    }

    return wasm
      .then((response) => response.arrayBuffer())
      .then((buffer) => WebAssembly.instantiate(buffer, imports))
  } else {
    return WebAssembly.instantiate(wasm, imports)
  }
}

const createIntlSegmenterPolyfill = async (
  wasm: ArrayBufferLike | PromiseLike<Response>
) => {
  let breaks: [number, number, number][]

  const response = await instantiateWasmModule(wasm, {
    env: {
      push: (start: number, end: number, segmentType: number) => {
        breaks.push([start, end, segmentType])
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

  const allocStr = (str: string) => {
    const encoder = new TextEncoder()
    const view = encoder.encode(str + '\0')
    // typescript does not play well with webassembly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exports = ((response as any).instance.exports as unknown) as any

    const ptr = exports.malloc(view.length)
    const memory = new Uint8Array(exports.memory.buffer, ptr, view.length)
    memory.set(view)
    return [ptr, view]
  }

  return class Segmenter {
    locale: string
    options: { granularity: 'word' | 'grapheme' }

    constructor(locale: string, options: { granularity: 'word' | 'grapheme' }) {
      this.locale = locale
      this.options = options
    }

    segment(input: string) {
      const locale = this.locale
      const granularity = this.options.granularity
      const exports = ((response as any).instance.exports as unknown) as any

      breaks = []
      const [inputPtr, inputView] = allocStr(input)
      const [localePtr] = allocStr(locale)
      exports.break_iterator(BREAK_TYPES[granularity], localePtr, inputPtr)

      exports.free(localePtr)
      exports.free(inputPtr)

      const decoder = new TextDecoder()

      return breaks.map(([start, end, segmentType]) => ({
        segment: decoder.decode(inputView.slice(start, end)),
        index: decoder.decode(inputView.slice(0, start)).length,
        isWordLike: granularity === 'word' ? getSegmentType(segmentType) !== 'none' : undefined,
        breakType:
          granularity === 'word' ? getSegmentType(segmentType) : undefined,
      }))
    }
  }
}

export default createIntlSegmenterPolyfill
