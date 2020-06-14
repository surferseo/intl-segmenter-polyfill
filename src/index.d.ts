import 'fast-text-encoding';
export declare const createIntlSegmenterPolyfillFromFactory: (wasmFactory: (imports: Object) => {
    instance: WebAssembly.Instance;
}) => Promise<{
    new (locale: string, options: {
        granularity: 'word' | 'grapheme';
    }): {
        locale: string;
        options: {
            granularity: 'word' | 'grapheme';
        };
        segment(input: string): {
            segment: string;
            index: number;
            isWordLike: boolean;
            breakType: "number" | "none" | "word" | "kana" | "ideo";
        }[];
    };
}>;
export declare const createIntlSegmenterPolyfill: (wasm: ArrayBufferLike | PromiseLike<Response>) => Promise<{
    new (locale: string, options: {
        granularity: 'word' | 'grapheme';
    }): {
        locale: string;
        options: {
            granularity: 'word' | 'grapheme';
        };
        segment(input: string): {
            segment: string;
            index: number;
            isWordLike: boolean;
            breakType: "number" | "none" | "word" | "kana" | "ideo";
        }[];
    };
}>;
