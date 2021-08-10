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

test("Segments Japanese words", async () => {
  const Segmenter =
    await require("../dist/bundled.js").createIntlSegmenterPolyfill();
  const segments = new Segmenter("en", { granularity: "word" }).segment(
    "チンドン屋は、チンドン太鼓と呼ばれる楽器を鳴らすなどして人目を集め、その地域の商品や店舗などの宣伝を行う日本の請負広告業である。披露目屋・広目屋・東西屋と呼ぶ地域もある。"
  );
  expect(segments.map(({ segment }) => segment)).toEqual([
    "チン",
    "ドン",
    "屋",
    "は",
    "、",
    "チン",
    "ドン",
    "太鼓",
    "と",
    "呼ばれる",
    "楽器",
    "を",
    "鳴らす",
    "など",
    "し",
    "て",
    "人目",
    "を",
    "集め",
    "、",
    "その",
    "地域",
    "の",
    "商品",
    "や",
    "店舗",
    "など",
    "の",
    "宣伝",
    "を",
    "行う",
    "日本",
    "の",
    "請負",
    "広告",
    "業",
    "で",
    "ある",
    "。",
    "披露",
    "目",
    "屋",
    "・",
    "広目屋",
    "・",
    "東西",
    "屋",
    "と",
    "呼ぶ",
    "地域",
    "も",
    "ある",
    "。",
  ]);
});
