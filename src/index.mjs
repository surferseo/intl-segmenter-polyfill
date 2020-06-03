const createIntlSegmenterPolyfill = async (wasmBinary) => {
  let breaks

  const response = await WebAssembly.instantiate(wasmBinary, {
    env: {
      push: (a, b, c) => {
        breaks.push([a, b, c])
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

  const allocStr = (str) => {
    const encoder = new TextEncoder()
    const view = encoder.encode(str + '\0')

    const ptr = response.instance.exports.malloc(view.length)
    const memory = new Uint8Array(
      response.instance.exports.memory.buffer,
      ptr,
      view.length,
    )
    memory.set(view)
    return [ptr, view.length]
  }

  return {
    run: (locale, str) => {
      breaks = []
      const [inputPtr, inputLen] = allocStr(str)
      const [localePtr] = allocStr(locale)

      response.instance.exports.break_iterator(localePtr, inputPtr, inputLen)
      response.instance.exports.free(localePtr)
      response.instance.exports.free(inputPtr)
      return breaks
    },
  }
}

export default createIntlSegmenterPolyfill
