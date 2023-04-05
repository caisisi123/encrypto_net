(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.cryptoNet = {}));
})(this, function(exports2) {
  var _responseInterceptionObj, _requestInterceptionObj;
  "use strict";var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};

  function utf16ToBase64(str) {
    const utf8Arr = strToUTF8Arr(str);
    const base64Str = base64EncArr(utf8Arr);
    return base64Str;
  }
  function base64ToUtf16(base64Str) {
    const utf8Arr = base64DecToArr(base64Str);
    const utf16Str = UTF8ArrToStr(utf8Arr);
    return utf16Str;
  }
  function b64ToUint6(nChr) {
    return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
  }
  function base64DecToArr(sBase64, nBlocksSize) {
    const sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, "");
    const nInLen = sB64Enc.length;
    const nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2;
    const taBytes = new Uint8Array(nOutLen);
    let nMod3;
    let nMod4;
    let nUint24 = 0;
    let nOutIdx = 0;
    for (let nInIdx = 0; nInIdx < nInLen; nInIdx++) {
      nMod4 = nInIdx & 3;
      nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);
      if (nMod4 === 3 || nInLen - nInIdx === 1) {
        nMod3 = 0;
        while (nMod3 < 3 && nOutIdx < nOutLen) {
          taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
          nMod3++;
          nOutIdx++;
        }
        nUint24 = 0;
      }
    }
    return taBytes;
  }
  function uint6ToB64(nUint6) {
    return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
  }
  function base64EncArr(aBytes) {
    let nMod3 = 2;
    let sB64Enc = "";
    const nLen = aBytes.length;
    let nUint24 = 0;
    for (let nIdx = 0; nIdx < nLen; nIdx++) {
      nMod3 = nIdx % 3;
      nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
      if (nMod3 === 2 || aBytes.length - nIdx === 1) {
        sB64Enc += String.fromCodePoint(
          uint6ToB64(nUint24 >>> 18 & 63),
          uint6ToB64(nUint24 >>> 12 & 63),
          uint6ToB64(nUint24 >>> 6 & 63),
          uint6ToB64(nUint24 & 63)
        );
        nUint24 = 0;
      }
    }
    return sB64Enc.substring(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? "" : nMod3 === 1 ? "=" : "==");
  }
  function UTF8ArrToStr(aBytes) {
    let sView = "";
    let nPart;
    const nLen = aBytes.length;
    for (let nIdx = 0; nIdx < nLen; nIdx++) {
      nPart = aBytes[nIdx];
      sView += String.fromCodePoint(
        nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? (
          /* (nPart - 252 << 30) may be not so safe in ECMAScript! So…: */
          (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
        ) : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? (nPart - 192 << 6) + aBytes[++nIdx] - 128 : (
          /* nPart < 127 ? */
          /* one byte */
          nPart
        )
      );
    }
    return sView;
  }
  function strToUTF8Arr(sDOMStr) {
    let aBytes;
    let nChr;
    const nStrLen = sDOMStr.length;
    let nArrLen = 0;
    for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
      nChr = sDOMStr.codePointAt(nMapIdx);
      if (nChr >= 65536) {
        nMapIdx++;
      }
      nArrLen += nChr < 128 ? 1 : nChr < 2048 ? 2 : nChr < 65536 ? 3 : nChr < 2097152 ? 4 : nChr < 67108864 ? 5 : 6;
    }
    aBytes = new Uint8Array(nArrLen);
    let nIdx = 0;
    let nChrIdx = 0;
    while (nIdx < nArrLen) {
      nChr = sDOMStr.codePointAt(nChrIdx);
      if (nChr < 128) {
        aBytes[nIdx++] = nChr;
      } else if (nChr < 2048) {
        aBytes[nIdx++] = 192 + (nChr >>> 6);
        aBytes[nIdx++] = 128 + (nChr & 63);
      } else if (nChr < 65536) {
        aBytes[nIdx++] = 224 + (nChr >>> 12);
        aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
        aBytes[nIdx++] = 128 + (nChr & 63);
      } else if (nChr < 2097152) {
        aBytes[nIdx++] = 240 + (nChr >>> 18);
        aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
        aBytes[nIdx++] = 128 + (nChr & 63);
        nChrIdx++;
      } else if (nChr < 67108864) {
        aBytes[nIdx++] = 248 + (nChr >>> 24);
        aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
        aBytes[nIdx++] = 128 + (nChr & 63);
        nChrIdx++;
      } else {
        aBytes[nIdx++] = 252 + (nChr >>> 30);
        aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
        aBytes[nIdx++] = 128 + (nChr & 63);
        nChrIdx++;
      }
      nChrIdx++;
    }
    return aBytes;
  }
  function readBlob(blob, type) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", (e) => {
        if (reader.error) {
          reject(reader.error);
        } else {
          switch (type) {
            case "url":
              console.log(reader.result);
              resolve(URL.createObjectURL(blob));
              break;
            case "text":
              resolve(reader.result);
              break;
            case "stream":
              resolve(blob.stream());
              break;
            case "arrayBuffer":
              resolve(reader.result);
              break;
            case "dataUrl":
              resolve(reader.result);
            default:
              resolve(null);
              break;
          }
        }
      });
      switch (type) {
        case "url":
          reader.readAsDataURL(blob);
          break;
        case "text":
          reader.readAsText(blob);
          break;
        case "stream":
          reader.readAsBinaryString(blob);
          break;
        case "arrayBuffer":
          reader.readAsArrayBuffer(blob);
          break;
        case "dataUrl":
          reader.readAsDataURL(blob);
          break;
        default:
          resolve(null);
          break;
      }
    });
  }
  function readArrayBuffer(arraybuffer, type, options) {
    const dataView = new DataView(arraybuffer);
    switch (type) {
      case "string":
        const decoder = new TextDecoder(options.decodeType || "utf-8");
        return decoder.decode(arraybuffer);
      case "blob":
        return new Blob([arraybuffer], { type: options.blobType || "" });
      case "url":
        const url = URL.createObjectURL(new Blob([arraybuffer]));
        return url;
      case "dataView":
        return dataView;
      case "int8":
        const int8Array = new Int8Array(arraybuffer);
        return int8Array;
      case "int16":
        const int16Array = new Int16Array(arraybuffer);
        return int16Array;
      case "int32":
        const int32Array = new Int32Array(arraybuffer);
        return int32Array;
      case "uint8":
        const uint8Array = new Uint8Array(arraybuffer);
        return uint8Array;
      case "uint16":
        const uint16Array = new Uint16Array(arraybuffer);
        return uint16Array;
      case "uint32":
        const uint32Array = new Uint32Array(arraybuffer);
        return uint32Array;
      case "float32":
        const float32Array = new Float32Array(arraybuffer);
        return float32Array;
      case "float64":
        const float64Array = new Float64Array(arraybuffer);
        return float64Array;
      default:
        return null;
    }
  }
  function encodeToBinary(data, dataType, { type }) {
    if (dataType === "blob") {
      return new Blob([data], { type });
    } else if (dataType === "arraybuffer") {
      return new ArrayBuffer(data);
    } else if (dataType === "TypedArray") {
      switch (type) {
        case "Int8Array":
          return Int8Array.from(data);
        case "Uint8Array":
          return Uint8Array.from(data);
        case "Uint8ClampedArray":
          return Uint8ClampedArray.from(data);
        case "Int16Array":
          return Int16Array.from(data);
        case "Uint16Array":
          return Uint16Array.from(data);
        case "Int32Array":
          return Int32Array.from(data);
        case "Uint32Array":
          return Uint32Array.from(data);
        case "Float32Array":
          return Float32Array.from(data);
        case "Float64Array":
          return Float64Array.from(data);
        case "BigInt64Array":
          return BigInt64Array.from(data);
        case "BigUint64Array":
          return BigUint64Array.from(data);
        default:
          return Uint8Array.from(data);
      }
    } else {
      return Uint8Array.from(data);
    }
  }
  function encodeData(data, encoding) {
    let encodedData;
    switch (encoding) {
      case "base64":
        encodedData = utf16ToBase64(data);
        break;
      case "ascii":
        encodedData = "";
        for (let i = 0; i < data.length; i++) {
          const charCode = data.charCodeAt(i).toString(2);
          encodedData += charCode.padStart(8, "0");
        }
        break;
      case "utf8":
        const encoder = new TextEncoder();
        const utf8Data = encoder.encode(data);
        encodedData = String.fromCharCode.apply(null, utf8Data);
        break;
      case "gbk":
        encodedData = unescape(encodeURIComponent(data));
        break;
      case "utf16":
        encodedData = "";
        for (let i = 0; i < data.length; i++) {
          const charCode = data.charCodeAt(i).toString(16);
          encodedData += charCode.padStart(4, "0");
        }
        break;
      default:
        encodedData = data;
    }
    return encodedData;
  }
  function getEncryKey(method, algorithm, extractable, usages, options) {
    let keyPromise;
    switch (method) {
      case "generate":
        keyPromise = crypto.subtle.generateKey(algorithm, extractable, usages);
        break;
      case "derive":
        keyPromise = crypto.subtle.deriveKey(
          options.deriveAlgorithm,
          options.baseKey,
          algorithm,
          extractable,
          usages
        );
        break;
      case "unwrap":
        keyPromise = crypto.subtle.unwrapKey(
          options.format,
          options.wrappedKey,
          options.unwrappingKey,
          algorithm,
          extractable,
          usages
        );
        break;
      case "import":
        keyPromise = crypto.subtle.importKey(
          options.format,
          options.keyData,
          algorithm,
          extractable,
          usages
        );
        break;
      default:
        throw new Error(`Invalid method: ${method}`);
    }
    return keyPromise;
  }
  function encry(plainText, algorithmn, key, options) {
    let data = plainText;
    if (!ArrayBuffer.isView(data)) {
      if (options.format) {
        switch (options.format) {
          case "arrayBuffer":
            data = new ArrayBuffer(data.length);
            const dataView = new DataView(data);
            for (let i = 0; i < data.byteLength; i++) {
              dataView.setInt8(i, data[i]);
            }
            break;
          case "typedArray":
            data = Uint8Array.from(data);
            break;
          case "DataView":
            const buffer = new ArrayBuffer(data.length);
            const dataview = new DataView(buffer);
            for (let i = 0; i < data.byteLength; i++) {
              dataview.setInt8(i, data[i]);
            }
            data = dataview;
        }
      } else {
        data = Uint8Array.from(data);
      }
    }
    return window.crypto.subtle.encrypt(algorithmn, key, data);
  }
  function decry(cipherText, algorithmn, key) {
    return window.crypto.subtle.decrypt(algorithmn, key, cipherText);
  }
  function sign(data, algorithmn, key) {
    if (!ArrayBuffer.isView(data)) {
      data = Uint8Array.from(data);
    }
    return window.crypto.subtle.sign(algorithmn, key, data);
  }
  function verify(signedData, signature, algorithmn, key) {
    return window.crypto.subtle.verify(algorithmn, key, signature, signedData);
  }
  function generateDigest(algorithmn, data) {
    if (!ArrayBuffer.isView(data)) {
      data = Uint8Array.from(data);
    }
    return window.crypto.subtle.digest(algorithmn, data);
  }
  function fetchAxios(requestInterceptionObj, responseInterceptionObj) {
    return new Proxy(fetch, {
      apply(target, thisArg, argArray) {
        if (requestInterceptionObj.request) {
          requestInterceptionObj.request.apply(thisArg, argArray);
        }
        return target(...argArray).then((res) => {
          if (res.status >= 200 && res.status < 300) {
            if (responseInterceptionObj.response)
              responseInterceptionObj.response.apply(thisArg, res);
          } else {
            if (responseInterceptionObj.error)
              responseInterceptionObj.error(thisArg, res);
          }
        }).catch((error) => {
          if (requestInterceptionObj.error)
            requestInterceptionObj.error(error);
        });
      }
    });
  }
  class Axios {
    static mFetch(url, options) {
      return fetchAxios(__privateGet(this, _requestInterceptionObj), __privateGet(this, _responseInterceptionObj))(url, options);
    }
    static get(url, options) {
      return this.mFetch(url, Object.assign({ method: "GET" }, options));
    }
    static post(url, options) {
      return this.mFetch(url, Object.assign({ method: "POST" }, options));
    }
    static put(url, options) {
      return this.mFetch(url, Object.assign({ method: "PUT" }, options));
    }
    static delete(url, options) {
      return this.mFetch(url, Object.assign({ method: "DELETE" }, options));
    }
    static patch(url, options) {
      return this.mFetch(url, Object.assign({ method: "PATCH" }, options));
    }
    static options(url, options) {
      return this.mFetch(url, Object.assign({ method: "OPTIONS" }, options));
    }
    static head(url, options) {
      return this.mFetch(url, Object.assign({ method: "HEAD" }, options));
    }
    static trace(url, options) {
      return this.mFetch(url, Object.assign({ method: "TRACE" }, options));
    }
    static connect(url, options) {
      return this.mFetch(url, Object.assign({ method: "CONNECT" }, options));
    }
    static requestInterception(dealConfig, dealError) {
      __privateGet(this, _requestInterceptionObj).request = dealConfig;
      __privateGet(this, _requestInterceptionObj).error = dealError;
    }
    static responseInterception(dealResponse, dealError) {
      __privateGet(this, _responseInterceptionObj).response = dealResponse;
      __privateGet(this, _responseInterceptionObj).error = dealError;
    }
  }
  _responseInterceptionObj = new WeakMap();
  _requestInterceptionObj = new WeakMap();
  __privateAdd(Axios, _responseInterceptionObj, {});
  __privateAdd(Axios, _requestInterceptionObj, {});
  function preLoadScript(src) {
    window.addEventListener("DOMContentLoaded", () => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
    });
  }
  function prefetchAsset(src, { crossOrigin }) {
    window.requestIdleCallback(() => {
      const link = document.createElement("link");
      link.href = src;
      link.rel = "prefetch";
      const url = new URL(src, typeof document === "undefined" && typeof location === "undefined" ? require("url").pathToFileURL(__filename).href : typeof document === "undefined" ? location.href : document.currentScript && document.currentScript.src || new URL("cryptoNet.umd.js", document.baseURI).href);
      console.log(url.host);
      if (url.host !== document.location.host) {
        link.crossOrigin = crossOrigin || "use-credentials";
      }
      const ext = src.split(".").pop();
      switch (ext) {
        case "css":
          link.as = "style";
          break;
        case "png":
          link.as = "image";
          break;
        default:
          link.as = "fetch";
      }
      document.head.appendChild(link);
    });
  }
  function scrollLoad(containerSelector, offset, delay, options) {
    return new Promise((resolve, reject) => {
      const container = document.querySelector(containerSelector);
      function debounce(fn) {
        let timer = null;
        return function() {
          clearTimeout(timer);
          timer = setTimeout(fn, delay);
        };
      }
      container.addEventListener("scroll", debounce(function() {
        const { scrollTop, offsetHeight, scrollHeight } = div;
        if (scrollTop + offsetHeight > scrollHeight - offset) {
          resolve(true);
        }
      }));
    });
  }
  exports2.Axios = Axios;
  exports2.base64ToUtf16 = base64ToUtf16;
  exports2.decry = decry;
  exports2.encodeData = encodeData;
  exports2.encodeToBinary = encodeToBinary;
  exports2.encry = encry;
  exports2.generateDigest = generateDigest;
  exports2.getEncryKey = getEncryKey;
  exports2.preLoadScript = preLoadScript;
  exports2.prefetchAsset = prefetchAsset;
  exports2.readArrayBuffer = readArrayBuffer;
  exports2.readBlob = readBlob;
  exports2.scrollLoad = scrollLoad;
  exports2.sign = sign;
  exports2.utf16ToBase64 = utf16ToBase64;
  exports2.verify = verify;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
