var m = (r, t, e) => {
  if (!t.has(r))
    throw TypeError("Cannot " + e);
};
var f = (r, t, e) => (m(r, t, "read from private field"), e ? e.call(r) : t.get(r)), h = (r, t, e) => {
  if (t.has(r))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(r) : t.set(r, e);
};
function p(r) {
  const t = T(r);
  return U(t);
}
function D(r) {
  const t = b(r);
  return k(t);
}
function g(r) {
  return r > 64 && r < 91 ? r - 65 : r > 96 && r < 123 ? r - 71 : r > 47 && r < 58 ? r + 4 : r === 43 ? 62 : r === 47 ? 63 : 0;
}
function b(r, t) {
  const e = r.replace(/[^A-Za-z0-9+/]/g, ""), i = e.length, n = t ? Math.ceil((i * 3 + 1 >> 2) / t) * t : i * 3 + 1 >> 2, c = new Uint8Array(n);
  let o, s, a = 0, u = 0;
  for (let l = 0; l < i; l++)
    if (s = l & 3, a |= g(e.charCodeAt(l)) << 6 * (3 - s), s === 3 || i - l === 1) {
      for (o = 0; o < 3 && u < n; )
        c[u] = a >>> (16 >>> o & 24) & 255, o++, u++;
      a = 0;
    }
  return c;
}
function y(r) {
  return r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r === 62 ? 43 : r === 63 ? 47 : 65;
}
function U(r) {
  let t = 2, e = "";
  const i = r.length;
  let n = 0;
  for (let c = 0; c < i; c++)
    t = c % 3, n |= r[c] << (16 >>> t & 24), (t === 2 || r.length - c === 1) && (e += String.fromCodePoint(
      y(n >>> 18 & 63),
      y(n >>> 12 & 63),
      y(n >>> 6 & 63),
      y(n & 63)
    ), n = 0);
  return e.substring(0, e.length - 2 + t) + (t === 2 ? "" : t === 1 ? "=" : "==");
}
function k(r) {
  let t = "", e;
  const i = r.length;
  for (let n = 0; n < i; n++)
    e = r[n], t += String.fromCodePoint(
      e > 251 && e < 254 && n + 5 < i ? (
        /* (nPart - 252 << 30) may be not so safe in ECMAScript! So…: */
        (e - 252) * 1073741824 + (r[++n] - 128 << 24) + (r[++n] - 128 << 18) + (r[++n] - 128 << 12) + (r[++n] - 128 << 6) + r[++n] - 128
      ) : e > 247 && e < 252 && n + 4 < i ? (e - 248 << 24) + (r[++n] - 128 << 18) + (r[++n] - 128 << 12) + (r[++n] - 128 << 6) + r[++n] - 128 : e > 239 && e < 248 && n + 3 < i ? (e - 240 << 18) + (r[++n] - 128 << 12) + (r[++n] - 128 << 6) + r[++n] - 128 : e > 223 && e < 240 && n + 2 < i ? (e - 224 << 12) + (r[++n] - 128 << 6) + r[++n] - 128 : e > 191 && e < 224 && n + 1 < i ? (e - 192 << 6) + r[++n] - 128 : (
        /* nPart < 127 ? */
        /* one byte */
        e
      )
    );
  return t;
}
function T(r) {
  let t, e;
  const i = r.length;
  let n = 0;
  for (let s = 0; s < i; s++)
    e = r.codePointAt(s), e >= 65536 && s++, n += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : e < 2097152 ? 4 : e < 67108864 ? 5 : 6;
  t = new Uint8Array(n);
  let c = 0, o = 0;
  for (; c < n; )
    e = r.codePointAt(o), e < 128 ? t[c++] = e : e < 2048 ? (t[c++] = 192 + (e >>> 6), t[c++] = 128 + (e & 63)) : e < 65536 ? (t[c++] = 224 + (e >>> 12), t[c++] = 128 + (e >>> 6 & 63), t[c++] = 128 + (e & 63)) : e < 2097152 ? (t[c++] = 240 + (e >>> 18), t[c++] = 128 + (e >>> 12 & 63), t[c++] = 128 + (e >>> 6 & 63), t[c++] = 128 + (e & 63), o++) : e < 67108864 ? (t[c++] = 248 + (e >>> 24), t[c++] = 128 + (e >>> 18 & 63), t[c++] = 128 + (e >>> 12 & 63), t[c++] = 128 + (e >>> 6 & 63), t[c++] = 128 + (e & 63), o++) : (t[c++] = 252 + (e >>> 30), t[c++] = 128 + (e >>> 24 & 63), t[c++] = 128 + (e >>> 18 & 63), t[c++] = 128 + (e >>> 12 & 63), t[c++] = 128 + (e >>> 6 & 63), t[c++] = 128 + (e & 63), o++), o++;
  return t;
}
function S(r, t) {
  return new Promise((e, i) => {
    const n = new FileReader();
    switch (n.addEventListener("loadend", (c) => {
      if (n.error)
        i(n.error);
      else
        switch (t) {
          case "url":
            e(URL.createObjectURL(r));
            break;
          case "text":
            e(n.result);
            break;
          case "stream":
            e(r.stream());
            break;
          case "arrayBuffer":
            e(n.result);
            break;
          case "dataUrl":
            e(n.result);
          default:
            e(null);
            break;
        }
    }), t) {
      case "url":
        n.readAsDataURL(r);
        break;
      case "text":
        n.readAsText(r);
        break;
      case "stream":
        n.readAsBinaryString(r);
        break;
      case "arrayBuffer":
        n.readAsArrayBuffer(r);
        break;
      case "dataUrl":
        n.readAsDataURL(r);
        break;
      default:
        e(null);
        break;
    }
  });
}
function O(r, t, e) {
  const i = new DataView(r);
  switch (t) {
    case "string":
      return new TextDecoder(e.decodeType || "utf-8").decode(r);
    case "blob":
      return new Blob([r], { type: e.blobType || "" });
    case "url":
      return URL.createObjectURL(new Blob([r]));
    case "dataView":
      return i;
    case "int8":
      return new Int8Array(r);
    case "int16":
      return new Int16Array(r);
    case "int32":
      return new Int32Array(r);
    case "uint8":
      return new Uint8Array(r);
    case "uint16":
      return new Uint16Array(r);
    case "uint32":
      return new Uint32Array(r);
    case "float32":
      return new Float32Array(r);
    case "float64":
      return new Float64Array(r);
    default:
      return null;
  }
}
function P(r, t, { type: e }) {
  if (t === "blob")
    return new Blob([r], { type: e });
  if (t === "arraybuffer")
    return new ArrayBuffer(r);
  if (t === "TypedArray")
    switch (e) {
      case "Int8Array":
        return Int8Array.from(r);
      case "Uint8Array":
        return Uint8Array.from(r);
      case "Uint8ClampedArray":
        return Uint8ClampedArray.from(r);
      case "Int16Array":
        return Int16Array.from(r);
      case "Uint16Array":
        return Uint16Array.from(r);
      case "Int32Array":
        return Int32Array.from(r);
      case "Uint32Array":
        return Uint32Array.from(r);
      case "Float32Array":
        return Float32Array.from(r);
      case "Float64Array":
        return Float64Array.from(r);
      case "BigInt64Array":
        return BigInt64Array.from(r);
      case "BigUint64Array":
        return BigUint64Array.from(r);
      default:
        return Uint8Array.from(r);
    }
  else
    return Uint8Array.from(r);
}
function C(r, t) {
  let e;
  switch (t) {
    case "base64":
      e = p(r);
      break;
    case "ascii":
      e = "";
      for (let c = 0; c < r.length; c++) {
        const o = r.charCodeAt(c).toString(2);
        e += o.padStart(8, "0");
      }
      break;
    case "utf8":
      const n = new TextEncoder().encode(r);
      e = String.fromCharCode.apply(null, n);
      break;
    case "gbk":
      e = unescape(encodeURIComponent(r));
      break;
    case "utf16":
      e = "";
      for (let c = 0; c < r.length; c++) {
        const o = r.charCodeAt(c).toString(16);
        e += o.padStart(4, "0");
      }
      break;
    default:
      e = r;
  }
  return e;
}
function V(r, t, e, i, n) {
  let c;
  switch (r) {
    case "generate":
      c = crypto.subtle.generateKey(t, e, i);
      break;
    case "derive":
      c = crypto.subtle.deriveKey(
        n.deriveAlgorithm,
        n.baseKey,
        t,
        e,
        i
      );
      break;
    case "unwrap":
      c = crypto.subtle.unwrapKey(
        n.format,
        n.wrappedKey,
        n.unwrappingKey,
        t,
        e,
        i
      );
      break;
    case "import":
      c = crypto.subtle.importKey(
        n.format,
        n.keyData,
        t,
        e,
        i
      );
      break;
    default:
      throw new Error(`Invalid method: ${r}`);
  }
  return c;
}
function R(r, t, e, i) {
  let n = r;
  if (!ArrayBuffer.isView(n))
    if (i.format)
      switch (i.format) {
        case "arrayBuffer":
          n = new ArrayBuffer(n.length);
          const c = new DataView(n);
          for (let a = 0; a < n.byteLength; a++)
            c.setInt8(a, n[a]);
          break;
        case "typedArray":
          n = Uint8Array.from(n);
          break;
        case "DataView":
          const o = new ArrayBuffer(n.length), s = new DataView(o);
          for (let a = 0; a < n.byteLength; a++)
            s.setInt8(a, n[a]);
          n = s;
      }
    else
      n = Uint8Array.from(n);
  return window.crypto.subtle.encrypt(t, e, n);
}
function j(r, t, e) {
  return window.crypto.subtle.decrypt(t, e, r);
}
function K(r, t, e) {
  return ArrayBuffer.isView(r) || (r = Uint8Array.from(r)), window.crypto.subtle.sign(t, e, r);
}
function B(r, t, e, i) {
  return window.crypto.subtle.verify(e, i, t, r);
}
function v(r, t) {
  return ArrayBuffer.isView(t) || (t = Uint8Array.from(t)), window.crypto.subtle.digest(r, t);
}
function I(r, t) {
  return new Proxy(fetch, {
    apply(e, i, n) {
      return r.request && r.request.apply(i, n), e(...n).then((c) => {
        c.status >= 200 && c.status < 300 ? t.response && t.response.apply(i, c) : t.error && t.error(i, c);
      }).catch((c) => {
        r.error && r.error(c);
      });
    }
  });
}
var d, A;
class w {
  static mFetch(t, e) {
    return I(f(this, A), f(this, d))(t, e);
  }
  static get(t, e) {
    return this.mFetch(t, Object.assign({ method: "GET" }, e));
  }
  static post(t, e) {
    return this.mFetch(t, Object.assign({ method: "POST" }, e));
  }
  static put(t, e) {
    return this.mFetch(t, Object.assign({ method: "PUT" }, e));
  }
  static delete(t, e) {
    return this.mFetch(t, Object.assign({ method: "DELETE" }, e));
  }
  static patch(t, e) {
    return this.mFetch(t, Object.assign({ method: "PATCH" }, e));
  }
  static options(t, e) {
    return this.mFetch(t, Object.assign({ method: "OPTIONS" }, e));
  }
  static head(t, e) {
    return this.mFetch(t, Object.assign({ method: "HEAD" }, e));
  }
  static trace(t, e) {
    return this.mFetch(t, Object.assign({ method: "TRACE" }, e));
  }
  static connect(t, e) {
    return this.mFetch(t, Object.assign({ method: "CONNECT" }, e));
  }
  static requestInterception(t, e) {
    f(this, A).request = t, f(this, A).error = e;
  }
  static responseInterception(t, e) {
    f(this, d).response = t, f(this, d).error = e;
  }
}
d = new WeakMap(), A = new WeakMap(), h(w, d, {}), h(w, A, {});
function q(r) {
  window.addEventListener("DOMContentLoaded", () => {
    const t = document.createElement("script");
    t.src = r, t.async = !0, document.head.appendChild(t);
  });
}
function H(r, { crossOrigin: t }) {
  window.requestIdleCallback(() => {
    const e = document.createElement("link");
    switch (e.href = r, e.rel = "prefetch", new URL(r, import.meta.url).host !== document.location.host && (e.crossOrigin = t || "use-credentials"), r.split(".").pop()) {
      case "css":
        e.as = "style";
        break;
      case "png":
        e.as = "image";
        break;
      default:
        e.as = "fetch";
    }
    document.head.appendChild(e);
  });
}
function M(r, t, e, i) {
  return new Promise((n, c) => {
    const o = document.querySelector(r);
    function s(a) {
      let u = null;
      return function() {
        clearTimeout(u), u = setTimeout(a, e);
      };
    }
    o.addEventListener("scroll", s(function() {
      const { scrollTop: a, offsetHeight: u, scrollHeight: l } = div;
      a + u > l - t && n(!0);
    }));
  });
}
export {
  w as Axios,
  D as base64ToUtf16,
  j as decry,
  C as encodeData,
  P as encodeToBinary,
  R as encry,
  v as generateDigest,
  V as getEncryKey,
  q as preLoadScript,
  H as prefetchAsset,
  O as readArrayBuffer,
  S as readBlob,
  M as scrollLoad,
  K as sign,
  p as utf16ToBase64,
  B as verify
};
