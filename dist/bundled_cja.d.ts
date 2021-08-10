export declare const createIntlSegmenterPolyfill: () => Promise<{
    new (locale: string, options: {
        granularity: "word" | "grapheme";
    }): {
        locale: string;
        options: {
            granularity: "word" | "grapheme";
        };
        segment(input: string): {
            segment: string;
            index: number;
            isWordLike: boolean;
            breakType: "number" | "none" | "word" | "kana" | "ideo";
        }[];
    };
}>;
