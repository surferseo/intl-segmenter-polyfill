"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createIntlSegmenterPolyfill = void 0;
var BREAK_TYPES = {
    grapheme: 0,
    word: 1
};
var getSegmentType = function (type) {
    switch (type) {
        case 200:
            return 'word';
        case 100:
            return 'number';
        default:
            return 'none';
    }
};
exports.createIntlSegmenterPolyfill = function (wasm) { return __awaiter(void 0, void 0, void 0, function () {
    var breaks, response, allocStr, Segmenter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, WebAssembly.instantiateStreaming(wasm, {
                    env: {
                        push: function (start, end, segmentType) {
                            breaks.push([start, end, segmentType]);
                        },
                        __sys_stat64: function () { }
                    },
                    wasi_snapshot_preview1: {
                        proc_exit: function () { },
                        fd_close: function () { },
                        environ_sizes_get: function () { },
                        environ_get: function () { }
                    }
                })];
            case 1:
                response = _a.sent();
                allocStr = function (str) {
                    var encoder = new TextEncoder();
                    var view = encoder.encode(str + '\0');
                    // typescript does not play well with webassembly
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    var exports = response.instance.exports;
                    var ptr = exports.malloc(view.length);
                    var memory = new Uint8Array(exports.memory.buffer, ptr, view.length);
                    memory.set(view);
                    return [ptr, view];
                };
                Segmenter = /** @class */ (function () {
                    function Segmenter(locale, options) {
                        this.locale = locale;
                        this.options = options;
                    }
                    Segmenter.prototype.segment = function (input) {
                        var locale = this.locale;
                        var granularity = this.options.granularity;
                        var exports = response.instance.exports;
                        breaks = [];
                        var _a = allocStr(input), inputPtr = _a[0], inputView = _a[1];
                        var localePtr = allocStr(locale)[0];
                        exports.break_iterator(BREAK_TYPES[granularity], localePtr, inputPtr);
                        exports.free(localePtr);
                        exports.free(inputPtr);
                        var decoder = new TextDecoder();
                        return breaks.map(function (_a) {
                            var start = _a[0], end = _a[1], segmentType = _a[2];
                            return ({
                                segment: decoder.decode(inputView.slice(start, end)),
                                index: decoder.decode(inputView.slice(0, start)).length,
                                breakType: granularity === 'word' ? getSegmentType(segmentType) : undefined
                            });
                        });
                    };
                    return Segmenter;
                }());
                return [2 /*return*/, Segmenter];
        }
    });
}); };
