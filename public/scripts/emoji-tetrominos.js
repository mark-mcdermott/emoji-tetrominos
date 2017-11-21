(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
      }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    (function (process, global, Buffer, __argument0, __argument1, __argument2, __argument3, __filename, __dirname) {
      var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

      ;(function (exports) {
        'use strict';

        var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

        var PLUS = '+'.charCodeAt(0);
        var SLASH = '/'.charCodeAt(0);
        var NUMBER = '0'.charCodeAt(0);
        var LOWER = 'a'.charCodeAt(0);
        var UPPER = 'A'.charCodeAt(0);
        var PLUS_URL_SAFE = '-'.charCodeAt(0);
        var SLASH_URL_SAFE = '_'.charCodeAt(0);

        function decode(elt) {
          var code = elt.charCodeAt(0);
          if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
          if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
          if (code < NUMBER) return -1; //no match
          if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
          if (code < UPPER + 26) return code - UPPER;
          if (code < LOWER + 26) return code - LOWER + 26;
        }

        function b64ToByteArray(b64) {
          var i, j, l, tmp, placeHolders, arr;

          if (b64.length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
          }

          // the number of equal signs (place holders)
          // if there are two placeholders, than the two characters before it
          // represent one byte
          // if there is only one, then the three characters before it represent 2 bytes
          // this is just a cheap hack to not do indexOf twice
          var len = b64.length;
          placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

          // base64 is 4/3 + up to two characters of the original data
          arr = new Arr(b64.length * 3 / 4 - placeHolders);

          // if there are placeholders, only get up to the last complete 4 chars
          l = placeHolders > 0 ? b64.length - 4 : b64.length;

          var L = 0;

          function push(v) {
            arr[L++] = v;
          }

          for (i = 0, j = 0; i < l; i += 4, j += 3) {
            tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
            push((tmp & 0xFF0000) >> 16);
            push((tmp & 0xFF00) >> 8);
            push(tmp & 0xFF);
          }

          if (placeHolders === 2) {
            tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
            push(tmp & 0xFF);
          } else if (placeHolders === 1) {
            tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
            push(tmp >> 8 & 0xFF);
            push(tmp & 0xFF);
          }

          return arr;
        }

        function uint8ToBase64(uint8) {
          var i,
              extraBytes = uint8.length % 3,
              // if we have 1 byte left, pad 2 bytes
          output = "",
              temp,
              length;

          function encode(num) {
            return lookup.charAt(num);
          }

          function tripletToBase64(num) {
            return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
          }

          // go through the array every three bytes, we'll deal with trailing stuff later
          for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
            temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
            output += tripletToBase64(temp);
          }

          // pad the end with zeros, but make sure to not forget the extra bytes
          switch (extraBytes) {
            case 1:
              temp = uint8[uint8.length - 1];
              output += encode(temp >> 2);
              output += encode(temp << 4 & 0x3F);
              output += '==';
              break;
            case 2:
              temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
              output += encode(temp >> 10);
              output += encode(temp >> 4 & 0x3F);
              output += encode(temp << 2 & 0x3F);
              output += '=';
              break;
          }

          return output;
        }

        exports.toByteArray = b64ToByteArray;
        exports.fromByteArray = uint8ToBase64;
      })(typeof exports === 'undefined' ? this.base64js = {} : exports);
    }).call(this, require("pBGvAp"), typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/../node_modules/base64-js/lib/b64.js", "/../node_modules/base64-js/lib");
  }, { "buffer": 2, "pBGvAp": 4 }], 2: [function (require, module, exports) {
    (function (process, global, Buffer, __argument0, __argument1, __argument2, __argument3, __filename, __dirname) {
      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */

      var base64 = require('base64-js');
      var ieee754 = require('ieee754');

      exports.Buffer = Buffer;
      exports.SlowBuffer = Buffer;
      exports.INSPECT_MAX_BYTES = 50;
      Buffer.poolSize = 8192;

      /**
       * If `Buffer._useTypedArrays`:
       *   === true    Use Uint8Array implementation (fastest)
       *   === false   Use Object implementation (compatible down to IE6)
       */
      Buffer._useTypedArrays = function () {
        // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
        // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
        // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
        // because we need to be able to add all the node Buffer API methods. This is an issue
        // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
        try {
          var buf = new ArrayBuffer(0);
          var arr = new Uint8Array(buf);
          arr.foo = function () {
            return 42;
          };
          return 42 === arr.foo() && typeof arr.subarray === 'function'; // Chrome 9-10 lack `subarray`
        } catch (e) {
          return false;
        }
      }();

      /**
       * Class: Buffer
       * =============
       *
       * The Buffer constructor returns instances of `Uint8Array` that are augmented
       * with function properties for all the node `Buffer` API functions. We use
       * `Uint8Array` so that square bracket notation works as expected -- it returns
       * a single octet.
       *
       * By augmenting the instances, we can avoid modifying the `Uint8Array`
       * prototype.
       */
      function Buffer(subject, encoding, noZero) {
        if (!(this instanceof Buffer)) return new Buffer(subject, encoding, noZero);

        var type = typeof subject;

        // Workaround: node's base64 implementation allows for non-padded strings
        // while base64-js does not.
        if (encoding === 'base64' && type === 'string') {
          subject = stringtrim(subject);
          while (subject.length % 4 !== 0) {
            subject = subject + '=';
          }
        }

        // Find the length
        var length;
        if (type === 'number') length = coerce(subject);else if (type === 'string') length = Buffer.byteLength(subject, encoding);else if (type === 'object') length = coerce(subject.length); // assume that object is array-like
        else throw new Error('First argument needs to be a number, array or string.');

        var buf;
        if (Buffer._useTypedArrays) {
          // Preferred: Return an augmented `Uint8Array` instance for best performance
          buf = Buffer._augment(new Uint8Array(length));
        } else {
          // Fallback: Return THIS instance of Buffer (created by `new`)
          buf = this;
          buf.length = length;
          buf._isBuffer = true;
        }

        var i;
        if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
          // Speed optimization -- use set if we're copying from a typed array
          buf._set(subject);
        } else if (isArrayish(subject)) {
          // Treat array-ish objects as a byte array
          for (i = 0; i < length; i++) {
            if (Buffer.isBuffer(subject)) buf[i] = subject.readUInt8(i);else buf[i] = subject[i];
          }
        } else if (type === 'string') {
          buf.write(subject, 0, encoding);
        } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
          for (i = 0; i < length; i++) {
            buf[i] = 0;
          }
        }

        return buf;
      }

      // STATIC METHODS
      // ==============

      Buffer.isEncoding = function (encoding) {
        switch (String(encoding).toLowerCase()) {
          case 'hex':
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'binary':
          case 'base64':
          case 'raw':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return true;
          default:
            return false;
        }
      };

      Buffer.isBuffer = function (b) {
        return !!(b !== null && b !== undefined && b._isBuffer);
      };

      Buffer.byteLength = function (str, encoding) {
        var ret;
        str = str + '';
        switch (encoding || 'utf8') {
          case 'hex':
            ret = str.length / 2;
            break;
          case 'utf8':
          case 'utf-8':
            ret = utf8ToBytes(str).length;
            break;
          case 'ascii':
          case 'binary':
          case 'raw':
            ret = str.length;
            break;
          case 'base64':
            ret = base64ToBytes(str).length;
            break;
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            ret = str.length * 2;
            break;
          default:
            throw new Error('Unknown encoding');
        }
        return ret;
      };

      Buffer.concat = function (list, totalLength) {
        assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' + 'list should be an Array.');

        if (list.length === 0) {
          return new Buffer(0);
        } else if (list.length === 1) {
          return list[0];
        }

        var i;
        if (typeof totalLength !== 'number') {
          totalLength = 0;
          for (i = 0; i < list.length; i++) {
            totalLength += list[i].length;
          }
        }

        var buf = new Buffer(totalLength);
        var pos = 0;
        for (i = 0; i < list.length; i++) {
          var item = list[i];
          item.copy(buf, pos);
          pos += item.length;
        }
        return buf;
      };

      // BUFFER INSTANCE METHODS
      // =======================

      function _hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }

        // must be an even number of digits
        var strLen = string.length;
        assert(strLen % 2 === 0, 'Invalid hex string');

        if (length > strLen / 2) {
          length = strLen / 2;
        }
        for (var i = 0; i < length; i++) {
          var byte = parseInt(string.substr(i * 2, 2), 16);
          assert(!isNaN(byte), 'Invalid hex string');
          buf[offset + i] = byte;
        }
        Buffer._charsWritten = i * 2;
        return i;
      }

      function _utf8Write(buf, string, offset, length) {
        var charsWritten = Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length);
        return charsWritten;
      }

      function _asciiWrite(buf, string, offset, length) {
        var charsWritten = Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length);
        return charsWritten;
      }

      function _binaryWrite(buf, string, offset, length) {
        return _asciiWrite(buf, string, offset, length);
      }

      function _base64Write(buf, string, offset, length) {
        var charsWritten = Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length);
        return charsWritten;
      }

      function _utf16leWrite(buf, string, offset, length) {
        var charsWritten = Buffer._charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length);
        return charsWritten;
      }

      Buffer.prototype.write = function (string, offset, length, encoding) {
        // Support both (string, offset, length, encoding)
        // and the legacy (string, encoding, offset, length)
        if (isFinite(offset)) {
          if (!isFinite(length)) {
            encoding = length;
            length = undefined;
          }
        } else {
          // legacy
          var swap = encoding;
          encoding = offset;
          offset = length;
          length = swap;
        }

        offset = Number(offset) || 0;
        var remaining = this.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        encoding = String(encoding || 'utf8').toLowerCase();

        var ret;
        switch (encoding) {
          case 'hex':
            ret = _hexWrite(this, string, offset, length);
            break;
          case 'utf8':
          case 'utf-8':
            ret = _utf8Write(this, string, offset, length);
            break;
          case 'ascii':
            ret = _asciiWrite(this, string, offset, length);
            break;
          case 'binary':
            ret = _binaryWrite(this, string, offset, length);
            break;
          case 'base64':
            ret = _base64Write(this, string, offset, length);
            break;
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            ret = _utf16leWrite(this, string, offset, length);
            break;
          default:
            throw new Error('Unknown encoding');
        }
        return ret;
      };

      Buffer.prototype.toString = function (encoding, start, end) {
        var self = this;

        encoding = String(encoding || 'utf8').toLowerCase();
        start = Number(start) || 0;
        end = end !== undefined ? Number(end) : end = self.length;

        // Fastpath empty strings
        if (end === start) return '';

        var ret;
        switch (encoding) {
          case 'hex':
            ret = _hexSlice(self, start, end);
            break;
          case 'utf8':
          case 'utf-8':
            ret = _utf8Slice(self, start, end);
            break;
          case 'ascii':
            ret = _asciiSlice(self, start, end);
            break;
          case 'binary':
            ret = _binarySlice(self, start, end);
            break;
          case 'base64':
            ret = _base64Slice(self, start, end);
            break;
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            ret = _utf16leSlice(self, start, end);
            break;
          default:
            throw new Error('Unknown encoding');
        }
        return ret;
      };

      Buffer.prototype.toJSON = function () {
        return {
          type: 'Buffer',
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };

      // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
      Buffer.prototype.copy = function (target, target_start, start, end) {
        var source = this;

        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (!target_start) target_start = 0;

        // Copy 0 bytes; we're done
        if (end === start) return;
        if (target.length === 0 || source.length === 0) return;

        // Fatal error conditions
        assert(end >= start, 'sourceEnd < sourceStart');
        assert(target_start >= 0 && target_start < target.length, 'targetStart out of bounds');
        assert(start >= 0 && start < source.length, 'sourceStart out of bounds');
        assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds');

        // Are we oob?
        if (end > this.length) end = this.length;
        if (target.length - target_start < end - start) end = target.length - target_start + start;

        var len = end - start;

        if (len < 100 || !Buffer._useTypedArrays) {
          for (var i = 0; i < len; i++) target[i + target_start] = this[i + start];
        } else {
          target._set(this.subarray(start, start + len), target_start);
        }
      };

      function _base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }

      function _utf8Slice(buf, start, end) {
        var res = '';
        var tmp = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; i++) {
          if (buf[i] <= 0x7F) {
            res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
            tmp = '';
          } else {
            tmp += '%' + buf[i].toString(16);
          }
        }

        return res + decodeUtf8Char(tmp);
      }

      function _asciiSlice(buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; i++) ret += String.fromCharCode(buf[i]);
        return ret;
      }

      function _binarySlice(buf, start, end) {
        return _asciiSlice(buf, start, end);
      }

      function _hexSlice(buf, start, end) {
        var len = buf.length;

        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;

        var out = '';
        for (var i = start; i < end; i++) {
          out += toHex(buf[i]);
        }
        return out;
      }

      function _utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = '';
        for (var i = 0; i < bytes.length; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }

      Buffer.prototype.slice = function (start, end) {
        var len = this.length;
        start = clamp(start, len, 0);
        end = clamp(end, len, len);

        if (Buffer._useTypedArrays) {
          return Buffer._augment(this.subarray(start, end));
        } else {
          var sliceLen = end - start;
          var newBuf = new Buffer(sliceLen, undefined, true);
          for (var i = 0; i < sliceLen; i++) {
            newBuf[i] = this[i + start];
          }
          return newBuf;
        }
      };

      // `get` will be removed in Node 0.13+
      Buffer.prototype.get = function (offset) {
        console.log('.get() is deprecated. Access using array indexes instead.');
        return this.readUInt8(offset);
      };

      // `set` will be removed in Node 0.13+
      Buffer.prototype.set = function (v, offset) {
        console.log('.set() is deprecated. Access using array indexes instead.');
        return this.writeUInt8(v, offset);
      };

      Buffer.prototype.readUInt8 = function (offset, noAssert) {
        if (!noAssert) {
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset < this.length, 'Trying to read beyond buffer length');
        }

        if (offset >= this.length) return;

        return this[offset];
      };

      function _readUInt16(buf, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 1 < buf.length, 'Trying to read beyond buffer length');
        }

        var len = buf.length;
        if (offset >= len) return;

        var val;
        if (littleEndian) {
          val = buf[offset];
          if (offset + 1 < len) val |= buf[offset + 1] << 8;
        } else {
          val = buf[offset] << 8;
          if (offset + 1 < len) val |= buf[offset + 1];
        }
        return val;
      }

      Buffer.prototype.readUInt16LE = function (offset, noAssert) {
        return _readUInt16(this, offset, true, noAssert);
      };

      Buffer.prototype.readUInt16BE = function (offset, noAssert) {
        return _readUInt16(this, offset, false, noAssert);
      };

      function _readUInt32(buf, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
        }

        var len = buf.length;
        if (offset >= len) return;

        var val;
        if (littleEndian) {
          if (offset + 2 < len) val = buf[offset + 2] << 16;
          if (offset + 1 < len) val |= buf[offset + 1] << 8;
          val |= buf[offset];
          if (offset + 3 < len) val = val + (buf[offset + 3] << 24 >>> 0);
        } else {
          if (offset + 1 < len) val = buf[offset + 1] << 16;
          if (offset + 2 < len) val |= buf[offset + 2] << 8;
          if (offset + 3 < len) val |= buf[offset + 3];
          val = val + (buf[offset] << 24 >>> 0);
        }
        return val;
      }

      Buffer.prototype.readUInt32LE = function (offset, noAssert) {
        return _readUInt32(this, offset, true, noAssert);
      };

      Buffer.prototype.readUInt32BE = function (offset, noAssert) {
        return _readUInt32(this, offset, false, noAssert);
      };

      Buffer.prototype.readInt8 = function (offset, noAssert) {
        if (!noAssert) {
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset < this.length, 'Trying to read beyond buffer length');
        }

        if (offset >= this.length) return;

        var neg = this[offset] & 0x80;
        if (neg) return (0xff - this[offset] + 1) * -1;else return this[offset];
      };

      function _readInt16(buf, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 1 < buf.length, 'Trying to read beyond buffer length');
        }

        var len = buf.length;
        if (offset >= len) return;

        var val = _readUInt16(buf, offset, littleEndian, true);
        var neg = val & 0x8000;
        if (neg) return (0xffff - val + 1) * -1;else return val;
      }

      Buffer.prototype.readInt16LE = function (offset, noAssert) {
        return _readInt16(this, offset, true, noAssert);
      };

      Buffer.prototype.readInt16BE = function (offset, noAssert) {
        return _readInt16(this, offset, false, noAssert);
      };

      function _readInt32(buf, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
        }

        var len = buf.length;
        if (offset >= len) return;

        var val = _readUInt32(buf, offset, littleEndian, true);
        var neg = val & 0x80000000;
        if (neg) return (0xffffffff - val + 1) * -1;else return val;
      }

      Buffer.prototype.readInt32LE = function (offset, noAssert) {
        return _readInt32(this, offset, true, noAssert);
      };

      Buffer.prototype.readInt32BE = function (offset, noAssert) {
        return _readInt32(this, offset, false, noAssert);
      };

      function _readFloat(buf, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
        }

        return ieee754.read(buf, offset, littleEndian, 23, 4);
      }

      Buffer.prototype.readFloatLE = function (offset, noAssert) {
        return _readFloat(this, offset, true, noAssert);
      };

      Buffer.prototype.readFloatBE = function (offset, noAssert) {
        return _readFloat(this, offset, false, noAssert);
      };

      function _readDouble(buf, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset + 7 < buf.length, 'Trying to read beyond buffer length');
        }

        return ieee754.read(buf, offset, littleEndian, 52, 8);
      }

      Buffer.prototype.readDoubleLE = function (offset, noAssert) {
        return _readDouble(this, offset, true, noAssert);
      };

      Buffer.prototype.readDoubleBE = function (offset, noAssert) {
        return _readDouble(this, offset, false, noAssert);
      };

      Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset < this.length, 'trying to write beyond buffer length');
          verifuint(value, 0xff);
        }

        if (offset >= this.length) return;

        this[offset] = value;
      };

      function _writeUInt16(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 1 < buf.length, 'trying to write beyond buffer length');
          verifuint(value, 0xffff);
        }

        var len = buf.length;
        if (offset >= len) return;

        for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
          buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
        }
      }

      Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
        _writeUInt16(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
        _writeUInt16(this, value, offset, false, noAssert);
      };

      function _writeUInt32(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 3 < buf.length, 'trying to write beyond buffer length');
          verifuint(value, 0xffffffff);
        }

        var len = buf.length;
        if (offset >= len) return;

        for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
          buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
        }
      }

      Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
        _writeUInt32(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
        _writeUInt32(this, value, offset, false, noAssert);
      };

      Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset < this.length, 'Trying to write beyond buffer length');
          verifsint(value, 0x7f, -0x80);
        }

        if (offset >= this.length) return;

        if (value >= 0) this.writeUInt8(value, offset, noAssert);else this.writeUInt8(0xff + value + 1, offset, noAssert);
      };

      function _writeInt16(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 1 < buf.length, 'Trying to write beyond buffer length');
          verifsint(value, 0x7fff, -0x8000);
        }

        var len = buf.length;
        if (offset >= len) return;

        if (value >= 0) _writeUInt16(buf, value, offset, littleEndian, noAssert);else _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert);
      }

      Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
        _writeInt16(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
        _writeInt16(this, value, offset, false, noAssert);
      };

      function _writeInt32(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 3 < buf.length, 'Trying to write beyond buffer length');
          verifsint(value, 0x7fffffff, -0x80000000);
        }

        var len = buf.length;
        if (offset >= len) return;

        if (value >= 0) _writeUInt32(buf, value, offset, littleEndian, noAssert);else _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert);
      }

      Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
        _writeInt32(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
        _writeInt32(this, value, offset, false, noAssert);
      };

      function _writeFloat(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 3 < buf.length, 'Trying to write beyond buffer length');
          verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
        }

        var len = buf.length;
        if (offset >= len) return;

        ieee754.write(buf, value, offset, littleEndian, 23, 4);
      }

      Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
        _writeFloat(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
        _writeFloat(this, value, offset, false, noAssert);
      };

      function _writeDouble(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          assert(value !== undefined && value !== null, 'missing value');
          assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
          assert(offset !== undefined && offset !== null, 'missing offset');
          assert(offset + 7 < buf.length, 'Trying to write beyond buffer length');
          verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
        }

        var len = buf.length;
        if (offset >= len) return;

        ieee754.write(buf, value, offset, littleEndian, 52, 8);
      }

      Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
        _writeDouble(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
        _writeDouble(this, value, offset, false, noAssert);
      };

      // fill(value, start=0, end=buffer.length)
      Buffer.prototype.fill = function (value, start, end) {
        if (!value) value = 0;
        if (!start) start = 0;
        if (!end) end = this.length;

        if (typeof value === 'string') {
          value = value.charCodeAt(0);
        }

        assert(typeof value === 'number' && !isNaN(value), 'value is not a number');
        assert(end >= start, 'end < start');

        // Fill 0 bytes; we're done
        if (end === start) return;
        if (this.length === 0) return;

        assert(start >= 0 && start < this.length, 'start out of bounds');
        assert(end >= 0 && end <= this.length, 'end out of bounds');

        for (var i = start; i < end; i++) {
          this[i] = value;
        }
      };

      Buffer.prototype.inspect = function () {
        var out = [];
        var len = this.length;
        for (var i = 0; i < len; i++) {
          out[i] = toHex(this[i]);
          if (i === exports.INSPECT_MAX_BYTES) {
            out[i + 1] = '...';
            break;
          }
        }
        return '<Buffer ' + out.join(' ') + '>';
      };

      /**
       * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
       * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
       */
      Buffer.prototype.toArrayBuffer = function () {
        if (typeof Uint8Array !== 'undefined') {
          if (Buffer._useTypedArrays) {
            return new Buffer(this).buffer;
          } else {
            var buf = new Uint8Array(this.length);
            for (var i = 0, len = buf.length; i < len; i += 1) buf[i] = this[i];
            return buf.buffer;
          }
        } else {
          throw new Error('Buffer.toArrayBuffer not supported in this browser');
        }
      };

      // HELPER FUNCTIONS
      // ================

      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, '');
      }

      var BP = Buffer.prototype;

      /**
       * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
       */
      Buffer._augment = function (arr) {
        arr._isBuffer = true;

        // save reference to original Uint8Array get/set methods before overwriting
        arr._get = arr.get;
        arr._set = arr.set;

        // deprecated, will be removed in node 0.13+
        arr.get = BP.get;
        arr.set = BP.set;

        arr.write = BP.write;
        arr.toString = BP.toString;
        arr.toLocaleString = BP.toString;
        arr.toJSON = BP.toJSON;
        arr.copy = BP.copy;
        arr.slice = BP.slice;
        arr.readUInt8 = BP.readUInt8;
        arr.readUInt16LE = BP.readUInt16LE;
        arr.readUInt16BE = BP.readUInt16BE;
        arr.readUInt32LE = BP.readUInt32LE;
        arr.readUInt32BE = BP.readUInt32BE;
        arr.readInt8 = BP.readInt8;
        arr.readInt16LE = BP.readInt16LE;
        arr.readInt16BE = BP.readInt16BE;
        arr.readInt32LE = BP.readInt32LE;
        arr.readInt32BE = BP.readInt32BE;
        arr.readFloatLE = BP.readFloatLE;
        arr.readFloatBE = BP.readFloatBE;
        arr.readDoubleLE = BP.readDoubleLE;
        arr.readDoubleBE = BP.readDoubleBE;
        arr.writeUInt8 = BP.writeUInt8;
        arr.writeUInt16LE = BP.writeUInt16LE;
        arr.writeUInt16BE = BP.writeUInt16BE;
        arr.writeUInt32LE = BP.writeUInt32LE;
        arr.writeUInt32BE = BP.writeUInt32BE;
        arr.writeInt8 = BP.writeInt8;
        arr.writeInt16LE = BP.writeInt16LE;
        arr.writeInt16BE = BP.writeInt16BE;
        arr.writeInt32LE = BP.writeInt32LE;
        arr.writeInt32BE = BP.writeInt32BE;
        arr.writeFloatLE = BP.writeFloatLE;
        arr.writeFloatBE = BP.writeFloatBE;
        arr.writeDoubleLE = BP.writeDoubleLE;
        arr.writeDoubleBE = BP.writeDoubleBE;
        arr.fill = BP.fill;
        arr.inspect = BP.inspect;
        arr.toArrayBuffer = BP.toArrayBuffer;

        return arr;
      };

      // slice(start, end)
      function clamp(index, len, defaultValue) {
        if (typeof index !== 'number') return defaultValue;
        index = ~~index; // Coerce to integer.
        if (index >= len) return len;
        if (index >= 0) return index;
        index += len;
        if (index >= 0) return index;
        return 0;
      }

      function coerce(length) {
        // Coerce length to a number (possibly NaN), round up
        // in case it's fractional (e.g. 123.456) then do a
        // double negate to coerce a NaN to 0. Easy, right?
        length = ~~Math.ceil(+length);
        return length < 0 ? 0 : length;
      }

      function isArray(subject) {
        return (Array.isArray || function (subject) {
          return Object.prototype.toString.call(subject) === '[object Array]';
        })(subject);
      }

      function isArrayish(subject) {
        return isArray(subject) || Buffer.isBuffer(subject) || subject && typeof subject === 'object' && typeof subject.length === 'number';
      }

      function toHex(n) {
        if (n < 16) return '0' + n.toString(16);
        return n.toString(16);
      }

      function utf8ToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; i++) {
          var b = str.charCodeAt(i);
          if (b <= 0x7F) byteArray.push(str.charCodeAt(i));else {
            var start = i;
            if (b >= 0xD800 && b <= 0xDFFF) i++;
            var h = encodeURIComponent(str.slice(start, i + 1)).substr(1).split('%');
            for (var j = 0; j < h.length; j++) byteArray.push(parseInt(h[j], 16));
          }
        }
        return byteArray;
      }

      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; i++) {
          // Node's code seems to be doing this and not & 0x7F..
          byteArray.push(str.charCodeAt(i) & 0xFF);
        }
        return byteArray;
      }

      function utf16leToBytes(str) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; i++) {
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }

        return byteArray;
      }

      function base64ToBytes(str) {
        return base64.toByteArray(str);
      }

      function blitBuffer(src, dst, offset, length) {
        var pos;
        for (var i = 0; i < length; i++) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }

      function decodeUtf8Char(str) {
        try {
          return decodeURIComponent(str);
        } catch (err) {
          return String.fromCharCode(0xFFFD); // UTF 8 invalid char
        }
      }

      /*
       * We have to make sure that the value is a valid integer. This means that it
       * is non-negative. It has no fractional component and that it does not
       * exceed the maximum allowed value.
       */
      function verifuint(value, max) {
        assert(typeof value === 'number', 'cannot write a non-number as a number');
        assert(value >= 0, 'specified a negative value for writing an unsigned value');
        assert(value <= max, 'value is larger than maximum value for type');
        assert(Math.floor(value) === value, 'value has a fractional component');
      }

      function verifsint(value, max, min) {
        assert(typeof value === 'number', 'cannot write a non-number as a number');
        assert(value <= max, 'value larger than maximum allowed value');
        assert(value >= min, 'value smaller than minimum allowed value');
        assert(Math.floor(value) === value, 'value has a fractional component');
      }

      function verifIEEE754(value, max, min) {
        assert(typeof value === 'number', 'cannot write a non-number as a number');
        assert(value <= max, 'value larger than maximum allowed value');
        assert(value >= min, 'value smaller than minimum allowed value');
      }

      function assert(test, message) {
        if (!test) throw new Error(message || 'Failed assertion');
      }
    }).call(this, require("pBGvAp"), typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/../node_modules/buffer/index.js", "/../node_modules/buffer");
  }, { "base64-js": 1, "buffer": 2, "ieee754": 3, "pBGvAp": 4 }], 3: [function (require, module, exports) {
    (function (process, global, Buffer, __argument0, __argument1, __argument2, __argument3, __filename, __dirname) {
      exports.read = function (buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];

        i += d;

        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };

      exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

        value = Math.abs(value);

        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }

          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }

        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

        buffer[offset + i - d] |= s * 128;
      };
    }).call(this, require("pBGvAp"), typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/../node_modules/ieee754/index.js", "/../node_modules/ieee754");
  }, { "buffer": 2, "pBGvAp": 4 }], 4: [function (require, module, exports) {
    (function (process, global, Buffer, __argument0, __argument1, __argument2, __argument3, __filename, __dirname) {
      // shim for using process in browser

      var process = module.exports = {};

      process.nextTick = function () {
        var canSetImmediate = typeof window !== 'undefined' && window.setImmediate;
        var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;

        if (canSetImmediate) {
          return function (f) {
            return window.setImmediate(f);
          };
        }

        if (canPost) {
          var queue = [];
          window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
              ev.stopPropagation();
              if (queue.length > 0) {
                var fn = queue.shift();
                fn();
              }
            }
          }, true);

          return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
          };
        }

        return function nextTick(fn) {
          setTimeout(fn, 0);
        };
      }();

      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      // TODO(shtylman)
      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
    }).call(this, require("pBGvAp"), typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/../node_modules/process/browser.js", "/../node_modules/process");
  }, { "buffer": 2, "pBGvAp": 4 }], 5: [function (require, module, exports) {
    (function (process, global, Buffer, __argument0, __argument1, __argument2, __argument3, __filename, __dirname) {
      // -------------------------------------------------------------
      // --------------------- Block Class ---------------------------
      // -------------------------------------------------------------

      // Blocks have letter name: I, T, J, L & O (http://i.imgur.com/9Z0oJXe.png)
      // All block movement/collision calculated from block coordiates
      // Blocks are made of 4 "pixels"
      // First block "pixel" is top left pixel
      // Subsequent block coordinates are calculated from first pixel
      // Rotations based on NES Tetris (http://imgur.com/a/IVRrf)

      // For collision detection, make first coordinate pair in coords
      // array the block's far left pixel.  Make the last coorinate
      // coordinate pair the far right pixel.


      module.exports = class Block {

        // block constructor (needs block letter & initial coords)
        constructor(letter, x, y) {
          this.letter = letter.toUpperCase();
          this[`_init${this.letter}`](x, y);
        }

        // init L block (needs its initial coords)
        _initL(x, y) {
          this.height = 2; // L block height (for floor/block collision)
          this.width = 3; // L block width (for wall collision)
          this.numPix = 4; // num pixels in L block
          this.curRotation = 0; // current pos in rotations array
          this.emoji = "😀";
          this.coords = [[x, y], [x, y + 1], [x + 1, y], [x + 2, y]];
          this.rotate = function () {

            // gets current x & y
            let x = this.coords[0][0];
            let y = this.coords[0][1];

            // if L is vert, checks for collisions
            if (this.curRotation === 0 && y < 1 || this.curRotation === 1 && x < 1 || this.curRotation === 1 && x > 7 || this.curRotation === 3 && x < 1) {
              return;
            }

            if (x >= 0 && x < 9) {

              // advances curRotation (always 0 or 1)
              this.curRotation = (this.curRotation + 1) % 4;

              // rotates to new curRotation
              switch (this.curRotation) {

                /* down facing L block */
                case 0:
                  this.coords = [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x - 1, y + 2]];
                  break;

                /* left facing L block */
                case 1:
                  this.coords = [[x, y - 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]];
                  break;

                /* up facing L block */
                case 2:
                  this.coords = [[x, y + 1], [x + 1, y + 1], [x + 2, y + 1], [x + 2, y]];
                  break;

                /* right facing L block */
                case 3:
                  this.coords = [[x + 1, y - 1], [x + 1, y], [x + 1, y + 1], [x + 2, y + 1]];
                  break;

              }
            }
          };
        }

        // init J block (needs its initial coords)
        _initJ(x, y) {
          this.height = 2; // J block height (for floor/block collision)
          this.width = 3; // J block width (for wall collision)
          this.numPix = 4; // num pixels in J block
          this.curRotation = 0; // current pos in rotations array
          this.emoji = "💩";
          this.coords = [[x, y], [x + 1, y], [x + 2, y], [x + 2, y + 1]];
          this.rotate = function () {

            // gets current x & y
            let x = this.coords[0][0];
            let y = this.coords[0][1];

            // if J is vert, checks for collisions
            if (this.curRotation === 0 && y < 1 || this.curRotation === 1 && x < 1 || this.curRotation === 1 && x > 7 || this.curRotation === 3 && x < 1) {
              return;
            }

            if (x >= 0 && x < 9) {

              // advances curRotation (always 0 or 1)
              this.curRotation = (this.curRotation + 1) % 4;

              // rotates to new curRotation
              switch (this.curRotation) {

                /* down facing J block */
                case 0:
                  this.coords = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x + 1, y]];
                  break;

                /* left facing J block */
                case 1:
                  this.coords = [[x, y + 1], [x + 1, y + 1], [x + 1, y], [x + 1, y - 1]];
                  break;

                /* up facing J block */
                case 2:
                  this.coords = [[x, y - 2], [x, y - 1], [x + 1, y - 1], [x + 2, y - 1]];
                  break;

                /* right facing J block */
                case 3:
                  this.coords = [[x + 1, y + 2], [x + 1, y + 1], [x + 1, y], [x + 2, y]];
                  break;

              }
            }
          };
        }

        // init Z block (needs its initial coords)
        _initZ(x, y) {
          this.height = 2; // Z block height (for floor/block collision)
          this.width = 3; // Z block width (for wall collision)
          this.numPix = 4; // num pixels in Z block
          this.curRotation = 0; // current pos in rotations array
          this.emoji = "🐶";
          this.coords = [[x, y], [x + 1, y], [x + 1, y + 1], [x + 2, y + 1]];
          this.rotate = function () {

            // gets current x & y
            let x = this.coords[0][0];
            let y = this.coords[0][1];

            // if Z is vert, checks for collisions
            if (this.curRotation === 0 && y < 1) {
              return;
            }

            if (x >= 0 && x < 9) {

              // advances curRotation (always 0 or 1)
              this.curRotation = (this.curRotation + 1) % 2;

              // rotates to new curRotation
              switch (this.curRotation) {

                /* down facing Z block */
                case 0:
                  this.coords = [[x, y], [x - 1, y], [x, y + 1], [x + 1, y + 1]];
                  break;

                /* vert Z block */
                case 1:
                  this.coords = [[x, y], [x, y + 1], [x + 1, y], [x + 1, y - 1]];
                  break;

              }
            }
          };
        }

        // init S block (needs its initial coords)
        _initS(x, y) {
          this.height = 2; // S block height (for floor/block collision)
          this.width = 3; // S block width (for wall collision)
          this.numPix = 4; // num pixels in S block
          this.curRotation = 0; // current pos in rotations array
          this.emoji = "🐮";
          this.coords = [[x, y], [x + 1, y], [x + 1, y - 1], [x + 2, y - 1]];
          this.rotate = function () {

            // gets current x & y
            let x = this.coords[0][0];
            let y = this.coords[0][1];

            // if S is vert, checks for collisions
            if (this.curRotation === 0 && y < 1) {
              return;
            }

            if (x >= 0 && x < 9) {

              // advances curRotation (always 0 or 1)
              this.curRotation = (this.curRotation + 1) % 2;

              // rotates to new curRotation
              switch (this.curRotation) {

                /* down facing S block */
                case 0:
                  this.coords = [[x - 1, y + 1], [x, y + 1], [x, y], [x + 1, y]];
                  break;

                /* vert S block */
                case 1:
                  this.coords = [[x + 1, y - 1], [x + 1, y - 2], [x + 2, y - 1], [x + 2, y]];
                  break;

              }
            }
          };
        }

        // init T block (needs its initial coords)
        _initT(x, y) {
          this.height = 2; // T block height (for floor/block collision)
          this.width = 3; // T block width (for wall collision)
          this.numPix = 4; // num pixels in T block
          this.curRotation = 0; // current pos in rotations array
          this.emoji = "🚔";
          this.coords = [[x, y], [x + 1, y], [x + 1, y + 1], [x + 2, y]];
          this.rotate = function () {

            // gets current x & y
            let x = this.coords[0][0];
            let y = this.coords[0][1];

            // if T is vert, checks for collisions
            if (this.curRotation === 0 && y < 1 || this.curRotation === 1 && x > 7 || this.curRotation === 1 && x < 0 || this.curRotation === 3 && x < 1) {
              return;
            }

            if (x >= 0 && x < 9) {

              // advances curRotation (always 0 or 1)
              this.curRotation = (this.curRotation + 1) % 4;

              // rotates to new curRotation
              switch (this.curRotation) {

                /* down facing T block */
                case 0:
                  this.coords = [[x - 1, y - 1], [x, y - 1], [x, y], [x + 1, y - 1]];
                  break;

                /* left facing T block */
                case 1:
                  this.coords = [[x, y], [x + 1, y], [x + 1, y - 1], [x + 1, y + 1]];
                  break;

                /* up facing T block */
                case 2:
                  this.coords = [[x, y], [x + 1, y], [x + 1, y - 1], [x + 2, y]];
                  break;

                /* right facing T block */
                case 3:
                  this.coords = [[x + 1, y + 1], [x + 1, y], [x + 1, y - 1], [x + 2, y]];
                  break;

              }
            }
          };
        }

        // init I block (needs its initial coords)
        _initI(x, y) {
          this.height = 1; // I block height (for floor/block collision)
          this.width = 4; // I block width (for wall collision)
          this.numPix = 4; // num pixels in I block
          this.curRotation = 0; // current pos in rotations array
          this.emoji = "🚀";
          this.coords = [[x, y], [x + 1, y], [x + 2, y], [x + 3, y]];
          this.rotate = function () {

            // gets current x & y
            let x = this.coords[0][0];
            let y = this.coords[0][1];

            // if I is vert, checks for collisions
            if (this.curRotation === 0 && y < 2 || this.curRotation === 1 && x < 2) {
              return;
            }

            if (x >= 0 && x < 9) {

              // advances curRotation (always 0 or 1)
              this.curRotation = (this.curRotation + 1) % 2;

              // rotates to new curRotation
              switch (this.curRotation) {

                /* vert I block */
                case 0:
                  this.coords = [[x - 2, y + 2], [x - 1, y + 2], [x, y + 2], [x + 1, y + 2]];
                  break;

                /* horiz I block */
                case 1:
                  this.coords = [[x + 2, y - 2], [x + 2, y - 1], [x + 2, y], [x + 2, y + 1]];
                  break;

              }
            }
          };
        }

        // init I block (needs its initial coords)
        _initO(x, y) {
          this.height = 2; // I block height (for floor/block collision)
          this.width = 2; // I block width (for wall collision)
          this.numPix = 4; // num pixels in I block
          this.curRotation = 0; // current pos in rotations array
          this.emoji = "🍆";
          this.coords = [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]];
          this.rotate = function () {
            // no rotation on O block;
          };
        }

      };
    }).call(this, require("pBGvAp"), typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/block.js", "/");
  }, { "buffer": 2, "pBGvAp": 4 }], 6: [function (require, module, exports) {
    (function (process, global, Buffer, __argument0, __argument1, __argument2, __argument3, __filename, __dirname) {
      let block = require("./block.js");

      (function () {

        // init vars
        const canvas = document.getElementById("canvas"),
              ctx = canvas.getContext("2d"),
              canWidth = canvas.width,


        /*
           "Pixel" is unit of height/width, 1/10 width of board.
          Each block is made of 4 pixels.
         */

        // frame counter (needed for block entrance timing)
        // pixel = canWidth / 10.0;
        pixel = canWidth / 10;
        let frame = 0,
            speed = 125,

        // fontStyle = "18px Georgia",
        fontStyle = "30px Georgia",

        // colorI = '#1abc9c',
        // colorT = '#e67e22',
        // colorO = '#3498db',
        // colorJ = '#e74c3c',
        // colorL = '#9b59b6',
        // colorS = '#f1c40f',
        // colorZ = '#e97066',
        fallingBlock,


        /*
           2d array of board layout for keeping track
          of all "landed" blocks.
          Landed blocks are blocks that have hit
          the floor or hit other blocks collected at bottom.
           landed array is all 0's to start, since no
          blocks have hit the floor.  Every coordinate
          with a landed block will gets a 1.
         */

        landed = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

        // init blocks

        // function defs
        // helper functions - draw boxes & text to correct scale
        /*function strokeRec(x, y, w, h) {
          ctx.strokeRect(x * pixel, y * pixel, w * pixel, h * pixel);
        }*/
        // function fillText(text, x, y) {
        //   //console.log(text,x,y);
        //   //ctx.fillStyle = color;
        //   ctx.fillStyle = '#1abc9c';
        //   ctx.font="18px Georgia";
        //   //ctx.fillText("text", (x + 0.25) * pixel, (y + 0.75) * pixel);
        //   //ctx.fillText(text, (0 + 0.25) * pixel, (0 + 0.75) * pixel);
        //   ctx.fillText(text, (x + 0.25) * pixel, (y + 0.75) * pixel);
        //   //ctx.strokeRect(x * pixel, y * pixel, w * pixel, h * pixel);
        //   //ctx.strokeRect(0 * pixel, 0 * pixel, 1 * pixel, 1 * pixel);
        // }
        // function drawPixel(x, y, color) {
        //   ctx.fillStyle = color;
        //   ctx.fillRect(x * pixel, y * pixel, 1 * pixel, 1 * pixel);
        // }
        function drawBlock(coords, numPix, emoji) {
          for (let i = 0; i < numPix; i++) {
            //ctx.fillStyle = color;
            //ctx.fillRect(coords[i][0] * pixel, coords[i][1] * pixel, 1 * pixel, 1 * pixel);
            // drawText(emoji) {
            //ctx.fillStyle = '#1abc9c';
            ctx.font = fontStyle;
            ctx.fillText(emoji, coords[i][0] * pixel, coords[i][1] * pixel);
            //fillText(emoji, coords[i][0] * pixel, coords[i][1] * pixel);

            //}
          }
        }

        // add a numbered grid to board.  for debugging
        /*function makeGrid() {
          for (let i=0; i<10; i++) {
            strokeRec(i, 0, 1, 20);
          }
          for (let i=0; i<20; i++) {
            strokeRec(0, i, 10, 1);
          }
          for (let i=0; i<20; i++) {
            fillText(i, 0, i);
          }
          for (let i=1; i<10; i++) {
            fillText(i, i, 0);
          }
        }
        */

        // can copy emoji from http://unicode.org/emoji/charts/full-emoji-list.html#1f600
        // function drawText() {
        //     fillText("😀", 0, 0);
        // }

        function checkFullRows() {
          // check for any full rows
          for (let i = 0; i < 20; i++) {
            // goes down far left pixel from top of board to bottom
            // if far left pixel is a landed block, then it checks
            // that whole row to see if it's a full row ready to clear
            if (landed[i][0] !== 0) {
              let fullRow = true;
              for (let j = 1; j < 10; j++) {
                if (landed[i][j] === 0) {
                  fullRow = false;
                }
              }
              if (fullRow) {
                // clear the found full row
                for (let j = 0; j < 10; j++) {
                  landed[i][j] = 0;
                }

                /*
                   not positive, but i think there's an
                  intermittant bug here leaving certain
                  pixels floating and not dropping when
                  they should be dropped down one
                 */
                for (let k = i - 1; k >= 0; k--) {
                  for (let l = 0; l < 10; l++) {
                    if (landed[k][l] !== 0) {
                      landed[k + 1][l] = landed[k][l];
                      landed[k][l] = 0;
                    }
                  }
                }
              }
            }
          }
        }

        // move the falling block down
        function moveDown() {

          if (fallingBlock) {

            // check if block is touching bottom now
            let touchingFloor = false;
            for (let i = 0; i < fallingBlock.coords.length && touchingFloor === false; i++) {
              if (fallingBlock['coords'][i][1] === 19) {
                touchingFloor = true;
              }
            }

            // check if touching another block
            // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
            let collision = false;
            if (!touchingFloor) {
              for (let coords of fallingBlock.coords) {
                const [x, y] = coords;
                if (landed[y + 1][x] !== 0) {
                  collision = true;
                }
              }
            }

            // if at floor or , add block's pixels to landed array
            if (touchingFloor || collision) {
              for (let coords of fallingBlock.coords) {
                const [x, y] = coords;
                if (y === 0) {
                  return 'boardFull';
                }
                landed[y][x] = fallingBlock.letter;
              }
              fallingBlock = null;
              return 'cantMoveDown';
            } else {
              // lower the block
              for (let i = 0; i < fallingBlock.coords.length; i++) {
                fallingBlock['coords'][i][1]++;
              }
            }
          }
          return 'movedDown';
        }

        function moveSide(direction) {

          if (direction === 'left') {
            // if not at left edge, move left
            let firstPixel = fallingBlock['coords'][0];
            if (firstPixel[0] > 0) {

              // check if touching another block
              // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
              let collision = false;
              for (let coords of fallingBlock.coords) {
                const [x, y] = coords;
                if (x > 0 && y >= 0) {
                  //console.log(x+','+y+'   '+landed[y]);
                  if (landed[y][x - 1] !== 0) {
                    collision = true;
                  }
                }
              }

              if (!collision) {
                for (let i = 0; i < fallingBlock.coords.length; i++) {
                  fallingBlock['coords'][i][0]--;
                }
              }
            }
          }

          if (direction === 'right') {

            // TODO: run this check on every pixel in block, not just last
            // if not at right edge, move right
            let length = fallingBlock.coords.length;
            let lastPixel = fallingBlock['coords'][length - 1];
            if (lastPixel[0] < 9) {

              // check if touching another block
              // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
              let collision = false;
              for (let coords of fallingBlock.coords) {
                const [x, y] = coords;
                if (x < 9 && y >= 0) {
                  if (landed[y][x + 1] !== 0) {
                    collision = true;
                  }
                }
              }

              if (!collision) {
                for (let i = 0; i < fallingBlock.coords.length; i++) {
                  fallingBlock['coords'][i][0]++;
                }
              }
            }
          }
        }

        // rotate block
        function rotate() {
          // todo: add collision detection
          fallingBlock.rotate();
        }

        // clear the whole board each frame to redraw all pieces in new pos
        function clearBoard() {
          ctx.clearRect(0, 0, 10 * pixel, 20 * pixel);
        }

        // function getColor(block) {
        //   let color;
        //   switch (block) {
        //     case 'I':
        //       color = colorI;
        //       break;
        //     case 'T':
        //       color = colorT;
        //       break;
        //     case 'O':
        //       color = colorO;
        //       break;
        //     case 'S':
        //       color = colorS;
        //       break;
        //     case 'Z':
        //       color = colorZ;
        //       break;
        //     case 'J':
        //       color = colorJ;
        //       break;
        //     case 'L':
        //       color = colorL;
        //       break;
        //   }
        //   return color;
        // }

        function getEmoji(block) {
          // let color;
          let emoji;
          switch (block) {
            case 'I':
              // color = colorI;
              emoji = "🚀";
              break;
            case 'T':
              // color = colorT;
              emoji = "🚔";
              break;
            case 'O':
              // color = colorO;
              emoji = "🍆";
              break;
            case 'S':
              // color = colorS;
              emoji = "🐮";
              break;
            case 'Z':
              // color = colorZ;
              emoji = "🐶";
              break;
            case 'J':
              // color = colorJ;
              emoji = "💩";
              break;
            case 'L':
              // color = colorL;
              emoji = "😀";
              break;
          }
          // return color;
          return emoji;
        }

        // draw all pieces that have hit the bottom
        // (this set grows as new pieces hit the bottom)
        function drawLanded() {
          for (let i = 0; i < landed.length; i++) {
            for (let j = 0; j < landed[i].length; j++) {
              if (landed[i][j] !== 0) {
                //let color = getColor(landed[i][j]);
                let emoji = getEmoji(landed[i][j]);
                //  drawPixel(j,i,color);
                //ctx.fillStyle = '#1abc9c';
                ctx.font = fontStyle;
                ctx.fillText(emoji, j * pixel, i * pixel);
              }
            }
          }
        }

        function drawFallingBlock() {
          if (fallingBlock) {
            //let color = getColor(fallingBlock.letter);
            drawBlock(fallingBlock.coords, fallingBlock.numPix, fallingBlock.emoji);
          }
        }

        // // check if fallen pieces have reached top
        // // if so clear board
        // function checkFullBoard() {
        //   let boardFull = false;
        //   for (let i=0; i<10; i++) {
        //     if (landed[0][i] === 1) {
        //       boardFull = true;
        //     }
        //   }
        //   if (boardFull) {
        //     for (let i=0; i<10; i++) {
        //       for (let j=0; j<20; j++) {
        //         landed[j][i] = 0;
        //       }
        //     }
        //   }
        // }

        function moveDownOrNewBlock() {
          //console.log(speed);
          if (frame % (speed / 5) === 0) {
            if (!fallingBlock) {
              spawnBlock();
            }
          }
          if (frame % speed === 0) {
            if (moveDown() === 'boardFull') {
              return 'boardFull';
            }
          }
          return 'spawned';
        }

        function checkSpeedUp() {
          //console.log(frame, speed);
          if (frame % 1000 === 0) {
            if (speed > 49) {
              //console.log('a');
              speed -= 25;
            }
            if (speed > 10 && speed < 50) {
              //console.log('b');
              speed -= 5;
            }
          }
        }

        // spawns new block at top
        // (todo: x-pos will be random & will account for block width
        //        so not over either edge)
        // this falling var couldn't be seen by the other functions
        // (scoping issues), so scrapping for now...
        function spawnBlock() {

          let blockType;
          let x;
          const numBlock = Math.floor(Math.random() * 7);

          switch (numBlock) {

            case 0:
              blockType = 'i';
              x = Math.floor(Math.random() * (10 - 3));
              break;

            case 1:
              blockType = 'o';
              x = Math.floor(Math.random() * (10 - 2));
              break;

            case 2:
              blockType = 't';
              x = Math.floor(Math.random() * (10 - 2));
              break;

            case 3:
              blockType = 's';
              x = Math.floor(Math.random() * (10 - 2));
              break;

            case 4:
              blockType = 'z';
              x = Math.floor(Math.random() * (10 - 2));
              break;

            case 5:
              blockType = 'j';
              x = Math.floor(Math.random() * (10 - 2));
              break;

            case 6:
              blockType = 'l';
              x = Math.floor(Math.random() * (10 - 2));
              break;

          }

          const y = 0;
          fallingBlock = new block(blockType, x, y);
        }

        // process all keystrokes
        function processKeystroke(key) {

          if (!fallingBlock) {
            return;
          }

          // move block keyboard input
          switch (key) {

            case 38:
              // up arrow
              rotate();
              break;
            case 40:
              // down arrow
              moveDown();
              break;
            case 39:
              // right arrow
              moveSide('right');
              break;
            case 37:
              // left arrow
              moveSide('left');
              break;
          }
        }

        // function drawOnEvent(e) {
        //   draw();
        //   e.preventDefault();
        // }

        // main draw loop (calls itself recursively at end)
        function draw() {
          checkSpeedUp();
          if (moveDownOrNewBlock() === 'boardFull') {
            //console.log('boardFull: ' + boardFull);
            speed = 125;
            for (let i = 0; i < 10; i++) {
              for (let j = 0; j < 20; j++) {
                landed[j][i] = 0;
              }
            }
          }
          checkFullRows();
          clearBoard();
          //makeGrid();
          //drawText();
          drawLanded();
          drawFallingBlock();
          frame++;
          requestAnimationFrame(draw);
        }

        // event listeners
        // for testing - "next" button below board
        // (make sure moveDown() in draw() is uncommented)
        //document.getElementById("next").addEventListener("click", drawOnEvent);

        // event listener for all keystrokes
        document.onkeydown = function (e) {
          processKeystroke(e.keyCode);
        };

        // start game
        spawnBlock();
        draw(); // call main draw loop

      })();
    }).call(this, require("pBGvAp"), typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_160ec0ad.js", "/");
  }, { "./block.js": 5, "buffer": 2, "pBGvAp": 4 }] }, {}, [6]);
//# sourceMappingURL=emoji-tetrominos.js.map
