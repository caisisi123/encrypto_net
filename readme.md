# crypto_net

crypto_net是一个JavaScript库，可以简单实现加密、解密、消息摘要、签名和验证数据，编码和解码数据，以及网络请求统一拦截等。它还包括用于将数据转换为二进制数据，以及读取Arraybuffer,blob等二进制数据为其他形式数据的方法，以及提供一些与网络加载优化的相关方法，比如延迟加载、预加载和滚动加载等。

### 特点：
这是一个很小的包，没有臃肿的体积，且支持es6按需加载，帮助你tree-shaking。提供了实用的跟网络请求有关的工具函数。

### Installation

通过npm下载:

```bash
npm install crypto_net
```
### Usage:
```javascript
// es module
import {encode} from 'crypto_net'
```
### API:
#### 1. Encoding and Decoding

* base64ToUtf16(base64String: string): string
  将base64字符串转换为utf16编码的字符串。

* utf16ToBase64(utf16String: string): string
  将二进制数据编码为utf-16编码的字符串。

#### 2. Encryption and Decryption
*  getEncryKey(method, algorithm, extractable, usages, options):promise
promise兑现为生成一个CryptoKey密钥对象。

* encry(plainText,algorithmn,key,options): promise
promise兑现为一个包含密文数据的Arraybuffer。

* decry(cipherText,algorithmn,key):promise

  promise兑现为一个包含原数据的Arraybuffer。

#### 3. Signing and Verifying

* sign(data,algorithmn,key):promise
兑现为包含签名的Arraybuffer。
*  generateDigest(algorithmn,data):promise
兑现为包含摘要数据的ArrayBuffer。

* verify(signedData,signature,algorithmn,key):promise
兑现为表示是否验证通过的boolean。
#### 4. Axios类: 
封装了fetch,具有跟axios一样的拦截器功能。
* 通过Axios.get/post/delete/put/options/patch/connect等方法发起网络请求。
* 通过Axios.requestInterception(dealConfig,dealError)设置全局请求拦截器。
* 通过Axios.responseInterception(dealResponse,dealError)设置全局响应拦截器。
#### 4. 处理二进制数据
* readBlob(blob, type:"url"|"text"|"stream"|"dataUrl"|"arrayBuffer"):promise
兑现为给定类型数据
* readArrayBuffer(arraybuffer, type:"url"|"string"|"stream"|"dataUrl"|"arrayBuffer"|"blob"|"typedArray",options)
当type为'string'时在options中提供decodeType,为'blob'时在options提供blob的类型blobType。该函数会直接返回对应的数据。
* encodeToBinary(data,dataType:"blob"|"arrayBuffer"|"typedArray",{type})dataType为blob时在options.type中提供这个blob的类型，为typedArray时options.type提供特定类型如"Uint8Array"，该函数会直接返回对应的数据。
#### 5. Utility Functions
优化加载性能的根据函数：
* preLoadScript(src):void
在浏览器空闲时通过script标签预加载async的方式预加载脚本。

* prefetchAsset(src, {crossOrigin})
浏览器空闲时通过link预加载资源，需要指定跨域相关头部。

* scrollLoad(containerSelector,offset,delay,options):promise
当容器滚到距离底部offset的距离时promise兑现为true

License
This package is licensed under the MIT License.