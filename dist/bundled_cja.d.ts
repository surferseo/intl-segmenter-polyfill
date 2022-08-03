import { IntlSegmenterOptions, Segment } from '.';

export declare const createIntlSegmenterPolyfill: () => Promise<{
  new (locale: string, options: IntlSegmenterOptions): {
    locale: string;
    options: IntlSegmenterOptions;
    segment(input: string): Segment[];
  };
}>;
