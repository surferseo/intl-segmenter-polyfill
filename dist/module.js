
function _loadWasmModule (sync, src, imports) {
        var buf = null
        var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null
        if (isNode) {
          buf = Buffer.from(src, 'base64')
        } else {
          var raw = globalThis.atob(src)
          var rawLength = raw.length
          buf = new Uint8Array(new ArrayBuffer(rawLength))
          for(var i = 0; i < rawLength; i++) {
             buf[i] = raw.charCodeAt(i)
          }
        }

        if (imports && !sync) {
          return WebAssembly.instantiate(buf, imports)
        } else if (!imports && !sync) {
          return WebAssembly.compile(buf)
        } else {
          var mod = new WebAssembly.Module(buf)
          return imports ? new WebAssembly.Instance(mod, imports) : mod
        }
      }
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('break_iterator.wasm')) :
    typeof define === 'function' && define.amd ? define(['break_iterator.wasm'], factory) :
    (global = global || self, global.IntlSegmenterPolyfill = factory(global.break_iterator));
}(this, (function (break_iterator) { 'use strict';

    break_iterator = break_iterator && Object.prototype.hasOwnProperty.call(break_iterator, 'default') ? break_iterator['default'] : break_iterator;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
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
    }

    (function(l){function m(){}function k(c,a){c=void 0===c?"utf-8":c;a=void 0===a?{fatal:!1}:a;if(-1===n.indexOf(c.toLowerCase()))throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('"+c+"') is invalid.");if(a.fatal)throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");}if(l.TextEncoder&&l.TextDecoder)return !1;var n=["utf-8","utf8","unicode-1-1-utf-8"];Object.defineProperty(m.prototype,"encoding",{value:"utf-8"});m.prototype.encode=function(c,
    a){a=void 0===a?{stream:!1}:a;if(a.stream)throw Error("Failed to encode: the 'stream' option is unsupported.");a=0;for(var g=c.length,f=0,b=Math.max(32,g+(g>>1)+7),e=new Uint8Array(b>>3<<3);a<g;){var d=c.charCodeAt(a++);if(55296<=d&&56319>=d){if(a<g){var h=c.charCodeAt(a);56320===(h&64512)&&(++a,d=((d&1023)<<10)+(h&1023)+65536);}if(55296<=d&&56319>=d)continue}f+4>e.length&&(b+=8,b*=1+a/c.length*2,b=b>>3<<3,h=new Uint8Array(b),h.set(e),e=h);if(0===(d&4294967168))e[f++]=d;else {if(0===(d&4294965248))e[f++]=
    d>>6&31|192;else if(0===(d&4294901760))e[f++]=d>>12&15|224,e[f++]=d>>6&63|128;else if(0===(d&4292870144))e[f++]=d>>18&7|240,e[f++]=d>>12&63|128,e[f++]=d>>6&63|128;else continue;e[f++]=d&63|128;}}return e.slice?e.slice(0,f):e.subarray(0,f)};Object.defineProperty(k.prototype,"encoding",{value:"utf-8"});Object.defineProperty(k.prototype,"fatal",{value:!1});Object.defineProperty(k.prototype,"ignoreBOM",{value:!1});k.prototype.decode=function(c,a){a=void 0===a?{stream:!1}:a;if(a.stream)throw Error("Failed to decode: the 'stream' option is unsupported.");
    a=c;!(a instanceof Uint8Array)&&a.buffer instanceof ArrayBuffer&&(a=new Uint8Array(c.buffer));c=0;for(var g=[],f=[];;){var b=c<a.length;if(!b||c&65536){f.push(String.fromCharCode.apply(null,g));if(!b)return f.join("");g=[];a=a.subarray(c);c=0;}b=a[c++];if(0===b)g.push(0);else if(0===(b&128))g.push(b);else if(192===(b&224)){var e=a[c++]&63;g.push((b&31)<<6|e);}else if(224===(b&240)){e=a[c++]&63;var d=a[c++]&63;g.push((b&31)<<12|e<<6|d);}else if(240===(b&248)){e=a[c++]&63;d=a[c++]&63;var h=a[c++]&63;b=
    (b&7)<<18|e<<12|d<<6|h;65535<b&&(b-=65536,g.push(b>>>10&1023|55296),b=56320|b&1023);g.push(b);}}};l.TextEncoder=m;l.TextDecoder=k;})("undefined"!==typeof window?window:"undefined"!==typeof global?global:undefined);

    var BREAK_TYPES = {
        grapheme: 0,
        word: 1,
        sentence: 3
    };
    var getSegmentType = function (type) {
        if (type < 100) {
            return 'none';
        }
        else if (type >= 100 && type < 200) {
            return 'number';
        }
        else if (type >= 200 && type < 300) {
            return 'word';
        }
        else if (type >= 300 && type < 400) {
            return 'kana';
        }
        else if (type >= 400 && type < 500) {
            return 'ideo';
        }
    };
    var createIntlSegmenterPolyfillFromInstance = function (wasmInstance, values) { return __awaiter(void 0, void 0, void 0, function () {
        var allocStr;
        return __generator(this, function (_a) {
            allocStr = function (str) {
                var encoder = new TextEncoder();
                var view = encoder.encode(str + '\0');
                // typescript does not play well with webassembly
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                var exports = wasmInstance.exports;
                var ptr = exports.malloc(view.length);
                var memory = new Uint8Array(exports.memory.buffer, ptr, view.length);
                memory.set(view);
                return [ptr, view];
            };
            return [2 /*return*/, /** @class */ (function () {
                    function Segmenter(locale, options) {
                        this.locale = locale;
                        this.options = options;
                    }
                    Segmenter.prototype.segment = function (input) {
                        var locale = this.locale;
                        var granularity = this.options.granularity;
                        var exports = wasmInstance.exports;
                        values.current = [];
                        var _a = allocStr(input), inputPtr = _a[0], inputView = _a[1];
                        var localePtr = allocStr(locale)[0];
                        exports.break_iterator(BREAK_TYPES[granularity], localePtr, inputPtr);
                        exports.free(localePtr);
                        exports.free(inputPtr);
                        var decoder = new TextDecoder();
                        return values.current.map(function (_a) {
                            var start = _a[0], end = _a[1], segmentType = _a[2];
                            return ({
                                segment: decoder.decode(inputView.slice(start, end)),
                                index: decoder.decode(inputView.slice(0, start)).length,
                                isWordLike: granularity === 'word'
                                    ? getSegmentType(segmentType) !== 'none'
                                    : undefined,
                                breakType: granularity === 'word' ? getSegmentType(segmentType) : undefined
                            });
                        });
                    };
                    return Segmenter;
                }())];
        });
    }); };
    var getImports = function (callback) { return ({
        env: {
            push: function (start, end, segmentType) {
                callback([start, end, segmentType]);
            },
            __sys_stat64: function () { }
        },
        wasi_snapshot_preview1: {
            proc_exit: function () { },
            fd_close: function () { },
            environ_sizes_get: function () { },
            environ_get: function () { }
        }
    }); };
    var createIntlSegmenterPolyfillFromFactory = function (wasmFactory) { return __awaiter(void 0, void 0, void 0, function () {
        var values, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    values = { current: [] };
                    return [4 /*yield*/, wasmFactory(getImports(function (value) {
                            console.log(value);
                            values.current.push(value);
                        }))];
                case 1:
                    instance = (_a.sent()).instance;
                    return [2 /*return*/, createIntlSegmenterPolyfillFromInstance(instance, values)];
            }
        });
    }); };

    var createIntlSegmenterPolyfill = function () {
        return createIntlSegmenterPolyfillFromFactory(break_iterator);
    };

    return createIntlSegmenterPolyfill;

})));
