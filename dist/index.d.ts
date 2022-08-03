import 'fast-text-encoding';

export type IntlSegmenterOptions = {
    granularity: 'word' | 'grapheme' | 'sentence'
}

export type Segment = {
    segment: string;
    index: number;
    isWordLike: boolean;
    breakType: "number" | "none" | "word" | "kana" | "ideo";
}

export declare const createIntlSegmenterPolyfillFromFactory: (wasmFactory: (imports: Object) => {
    instance: WebAssembly.Instance;
}) => Promise<{
    new (locale: string, options: IntlSegmenterOptions): {
        locale: string;
        options: IntlSegmenterOptions;
        segment(input: string): Segment[];
    };
}>;
export declare const createIntlSegmenterPolyfill: (wasm: ArrayBufferLike | PromiseLike<Response>) => Promise<{
    new (locale: string, options: IntlSegmenterOptions): {
        locale: string;
        options: IntlSegmenterOptions;
        segment(input: string): Segment[];
    };
}>;
