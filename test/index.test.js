test("Bundled module", async () => {
  const Segmenter =
    await require("../dist/bundled.js").createIntlSegmenterPolyfill();
  const segments = new Segmenter("en", { granularity: "word" }).segment(
    "foo bar"
  );
  expect(Array.from(segments)).toEqual([
    { breakType: "word", index: 0, isWordLike: true, segment: "foo" },
    { breakType: "none", index: 3, isWordLike: false, segment: " " },
    { breakType: "word", index: 4, isWordLike: true, segment: "bar" },
  ]);
});

test("FS loaded module", async () => {
  const fs = require("fs");
  const wasmBuffer = fs.readFileSync("./dist/break_iterator.wasm");
  const wasmBinary = new Uint8Array(wasmBuffer);

  const Segmenter =
    await require("../dist/index.js").createIntlSegmenterPolyfill(wasmBinary);
  const segments = new Segmenter("en", { granularity: "word" }).segment(
    "foo bar"
  );
  expect(Array.from(segments)).toEqual([
    { breakType: "word", index: 0, isWordLike: true, segment: "foo" },
    { breakType: "none", index: 3, isWordLike: false, segment: " " },
    { breakType: "word", index: 4, isWordLike: true, segment: "bar" },
  ]);
});

test("segments.containing() direct access", async () => {
  const Segmenter =
    await require("../dist/bundled.js").createIntlSegmenterPolyfill();
  const segments = new Segmenter("en", { granularity: "word" }).segment(
    "foo bar"
  );
  expect(segments.containing(0).segment).toEqual("foo");
  expect(segments.containing(1).segment).toEqual("foo");
  expect(segments.containing(3).segment).toEqual(" ");
  expect(segments.containing(5).segment).toEqual("bar");
  expect(segments.containing(8)).toEqual(undefined);
});

test("segment by grapheme", async () => {
  const Segmenter =
    await require("../dist/bundled.js").createIntlSegmenterPolyfill();
  const segments = new Segmenter("en", { granularity: "grapheme" }).segment(
    "foo bar"
  );
  expect(segments.map(({ segment }) => segment)).toEqual([
    "f",
    "o",
    "o",
    " ",
    "b",
    "a",
    "r",
  ]);
});

test("defaults to grapheme segmenting", async () => {
  const Segmenter =
    await require("../dist/bundled.js").createIntlSegmenterPolyfill();
  const segments = new Segmenter("en").segment("foo bar");
  expect(segments.map(({ segment }) => segment)).toEqual([
    "f",
    "o",
    "o",
    " ",
    "b",
    "a",
    "r",
  ]);
});

test("segment by sentence", async () => {
  const Segmenter =
    await require("../dist/bundled.js").createIntlSegmenterPolyfill();
  const segments = new Segmenter("en", { granularity: "sentence" }).segment(
    "Foo bar. Foo bar."
  );
  expect(segments.map(({ segment }) => segment)).toEqual([
    "Foo bar. ",
    "Foo bar.",
  ]);
});

test("Segments Thai words", async () => {
  const Segmenter =
    await require("../dist/bundled.js").createIntlSegmenterPolyfill();
  const segments = new Segmenter("en", { granularity: "word" }).segment(
    "ยังมีอาสาสมัครน้อยมากเมื่อเทียบกับประชากรที่เข้าถึงอินเทอร์เน็ตได้"
  );
  expect(segments.map(({ segment }) => segment)).toEqual([
    "ยัง",
    "มี",
    "อาสา",
    "สมัคร",
    "น้อย",
    "มาก",
    "เมื่อ",
    "เทียบ",
    "กับ",
    "ประชากร",
    "ที่",
    "เข้า",
    "ถึง",
    "อินเทอร์เน็ต",
    "ได้",
  ]);
});
