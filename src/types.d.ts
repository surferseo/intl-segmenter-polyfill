declare module 'break_iterator.wasm' {
  const exports: (imports: object) => { instance: WebAssembly.Instance }
  export default exports
}
