# Intl Segmenter Polyfill

This repo builds .wasm module using icu4c for breaking text into words, so that we can polyfill [Intl Segmenter Proposal](https://github.com/tc39/proposal-intl-segmenter) with full compatibility, even on browsers that do not expose v8BreakIterator api.

## Building

Running `./build.sh` while having docker installed should output `break_iterator.wasm` ready to be used in Node, browsers or Wasmer without a lot of special treatment (see `examples/`).
