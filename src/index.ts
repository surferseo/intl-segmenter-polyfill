const BREAK_TYPES = {
  grapheme: 0,
  word: 1,
}

const getSegmentType = (type: number) => {
  switch (type) {
    case 200:
      return 'word' as const
    case 100:
      return 'number' as const
    default:
      return 'none' as const
  }
}

const createIntlSegmenterPolyfill = async (
  wasm: Response | PromiseLike<Response>,
) => {
  let breaks: [number, number, number][]

  // node env does not support instantiateStreaming
  // const instantiate =
  //   WebAssembly.instantiateStreaming || WebAssembly.instantiate
  const response = await WebAssembly.instantiate(wasm, {
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

  class Segmenter {
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
      console.log(this.options)
      exports.break_iterator(BREAK_TYPES[granularity], localePtr, inputPtr)

      exports.free(localePtr)
      exports.free(inputPtr)

      const decoder = new TextDecoder()

      return breaks.map(([start, end, segmentType]) => ({
        segment: decoder.decode(inputView.slice(start, end)),
        index: decoder.decode(inputView.slice(0, start)).length,
        breakType:
          granularity === 'word' ? getSegmentType(segmentType) : undefined,
      }))
    }
  }
  return Segmenter
}

export default createIntlSegmenterPolyfill
