declare const createIntlSegmenterPolyfill: (wasm: ArrayBufferLike | PromiseLike<Response>) => Promise<{
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
            breakType: "number" | "none" | "word";
        }[];
    };
}>;
export default createIntlSegmenterPolyfill;
