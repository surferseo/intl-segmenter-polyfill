(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/regenerator'), require('@babel/runtime/helpers/slicedToArray'), require('@babel/runtime/helpers/classCallCheck'), require('@babel/runtime/helpers/createClass'), require('@babel/runtime/helpers/asyncToGenerator'), require('fast-text-encoding')) :
  typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/regenerator', '@babel/runtime/helpers/slicedToArray', '@babel/runtime/helpers/classCallCheck', '@babel/runtime/helpers/createClass', '@babel/runtime/helpers/asyncToGenerator', 'fast-text-encoding'], factory) :
  (global = global || self, factory(global.IntlSegmenterPolyfill = {}, global._regeneratorRuntime, global._slicedToArray, global._classCallCheck, global._createClass, global._asyncToGenerator));
}(this, (function (exports, _regeneratorRuntime, _slicedToArray, _classCallCheck, _createClass, _asyncToGenerator) { 'use strict';

  _regeneratorRuntime = _regeneratorRuntime && Object.prototype.hasOwnProperty.call(_regeneratorRuntime, 'default') ? _regeneratorRuntime['default'] : _regeneratorRuntime;
  _slicedToArray = _slicedToArray && Object.prototype.hasOwnProperty.call(_slicedToArray, 'default') ? _slicedToArray['default'] : _slicedToArray;
  _classCallCheck = _classCallCheck && Object.prototype.hasOwnProperty.call(_classCallCheck, 'default') ? _classCallCheck['default'] : _classCallCheck;
  _createClass = _createClass && Object.prototype.hasOwnProperty.call(_createClass, 'default') ? _createClass['default'] : _createClass;
  _asyncToGenerator = _asyncToGenerator && Object.prototype.hasOwnProperty.call(_asyncToGenerator, 'default') ? _asyncToGenerator['default'] : _asyncToGenerator;

  var BREAK_TYPES = {
    grapheme: 0,
    word: 1,
    sentence: 3
  };

  var getSegmentType = function getSegmentType(type) {
    if (type < 100) {
      return 'none';
    } else if (type >= 100 && type < 200) {
      return 'number';
    } else if (type >= 200 && type < 300) {
      return 'word';
    } else if (type >= 300 && type < 400) {
      return 'kana';
    } else if (type >= 400 && type < 500) {
      return 'ideo';
    }
  };

  var instantiateWasmModule = function instantiateWasmModule(wasm, imports) {
    if (typeof wasm.then === 'function') {
      if (WebAssembly.instantiateStreaming != null) {
        return wasm.then(function (response) {
          return WebAssembly.instantiateStreaming(response, imports);
        });
      }

      return wasm.then(function (response) {
        return response.arrayBuffer();
      }).then(function (buffer) {
        return WebAssembly.instantiate(buffer, imports);
      });
    } else {
      return WebAssembly.instantiate(wasm, imports);
    }
  };

  var createIntlSegmenterPolyfillFromInstance = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(wasmInstance, values) {
      var allocStr;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              allocStr = function allocStr(str) {
                var encoder = new TextEncoder();
                var view = encoder.encode(str + '\0'); // typescript does not play well with webassembly
                // eslint-disable-next-line @typescript-eslint/no-explicit-any

                var exports = wasmInstance.exports;
                var ptr = exports.malloc(view.length);
                var memory = new Uint8Array(exports.memory.buffer, ptr, view.length);
                memory.set(view);
                return [ptr, view];
              };

              return _context.abrupt("return", /*#__PURE__*/function () {
                function Segmenter(locale, options) {
                  _classCallCheck(this, Segmenter);

                  this.locale = locale;
                  this.options = options || {};
                }

                _createClass(Segmenter, [{
                  key: "segment",
                  value: function segment(input) {
                    var locale = this.locale;
                    var granularity = this.options.granularity || 'grapheme';
                    var exports = wasmInstance.exports;
                    values.current = [];

                    var _allocStr = allocStr(input),
                        _allocStr2 = _slicedToArray(_allocStr, 2),
                        inputPtr = _allocStr2[0],
                        inputView = _allocStr2[1];

                    var _allocStr3 = allocStr(locale),
                        _allocStr4 = _slicedToArray(_allocStr3, 1),
                        localePtr = _allocStr4[0];

                    exports.utf8_break_iterator(BREAK_TYPES[granularity], localePtr, inputPtr, inputView.length);
                    exports.free(localePtr);
                    exports.free(inputPtr);
                    var index = 0;
                    var segments = values.current.map(function (_ref2) {
                      var _ref3 = _slicedToArray(_ref2, 3),
                          start = _ref3[0],
                          end = _ref3[1],
                          segmentType = _ref3[2];

                      var segment = input.slice(start, end);
                      var returnValue = {
                        segment: segment,
                        index: index,
                        isWordLike: granularity === 'word' ? getSegmentType(segmentType) !== 'none' : undefined,
                        breakType: granularity === 'word' ? getSegmentType(segmentType) : undefined
                      };
                      index += segment.length;
                      return returnValue;
                    });

                    segments.containing = function (indexToFind) {
                      return segments.find(function (_ref4) {
                        var index = _ref4.index,
                            segment = _ref4.segment;
                        return indexToFind >= index && indexToFind <= index + segment.length - 1;
                      });
                    };

                    return segments;
                  }
                }]);

                return Segmenter;
              }());

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function createIntlSegmenterPolyfillFromInstance(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var getImports = function getImports(callback) {
    return {
      env: {
        push: function push(start, end, segmentType) {
          callback([start, end, segmentType]);
        },
        __sys_stat64: function __sys_stat64() {}
      },
      wasi_snapshot_preview1: {
        proc_exit: function proc_exit() {},
        fd_close: function fd_close() {},
        environ_sizes_get: function environ_sizes_get() {},
        environ_get: function environ_get() {}
      }
    };
  };

  var createIntlSegmenterPolyfillFromFactory = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(wasmFactory) {
      var values, _yield$wasmFactory, instance;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              values = {
                current: []
              };
              _context2.next = 3;
              return wasmFactory(getImports(function (value) {
                values.current.push(value);
              }));

            case 3:
              _yield$wasmFactory = _context2.sent;
              instance = _yield$wasmFactory.instance;
              return _context2.abrupt("return", createIntlSegmenterPolyfillFromInstance(instance, values));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function createIntlSegmenterPolyfillFromFactory(_x3) {
      return _ref5.apply(this, arguments);
    };
  }();
  var createIntlSegmenterPolyfill = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(wasm) {
      var values, _yield$instantiateWas, instance;

      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              values = {
                current: []
              };
              _context3.next = 3;
              return instantiateWasmModule(wasm, getImports(function (value) {
                values.current.push(value);
              }));

            case 3:
              _yield$instantiateWas = _context3.sent;
              instance = _yield$instantiateWas.instance;
              return _context3.abrupt("return", createIntlSegmenterPolyfillFromInstance(instance, values));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function createIntlSegmenterPolyfill(_x4) {
      return _ref6.apply(this, arguments);
    };
  }();

  exports.createIntlSegmenterPolyfill = createIntlSegmenterPolyfill;
  exports.createIntlSegmenterPolyfillFromFactory = createIntlSegmenterPolyfillFromFactory;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
