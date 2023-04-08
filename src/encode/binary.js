
/**
 * 读取blob数据并返回对应类型的数据
 * @param {Blob} blob 要读取的blob对象
 * @param {string} type 要返回的数据类型，可选值为'url'、'text'、'stream'、'arrayBuffer'，默认为'text'
 * @returns {Promise} 返回一个Promise对象，resolve时传入对应类型的数据，reject时传入错误信息
 */
function readBlob(blob, type) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            if (reader.error) {
                reject(reader.error);
            } else {
                switch (type) {
                    case 'url':
                        console.log(reader.result);
                        resolve(URL.createObjectURL(blob));
                        break;
                    case 'text':
                        resolve(reader.result);
                        break;
                    case 'stream':
                        resolve(blob.stream());
                        break;
                    case 'arrayBuffer':
                        resolve(reader.result);
                        break;
                    case 'dataUrl':
                        resolve(reader.result)
                    default:
                        resolve(null);
                        break;
                }
            }
        });

        switch (type) {
            case 'url':
                reader.readAsDataURL(blob);
                break;
            case 'text':
                reader.readAsText(blob);
                break;
            case 'stream':
                reader.readAsBinaryString(blob);
                break;
            case 'arrayBuffer':
                reader.readAsArrayBuffer(blob);
                break;
            case 'dataUrl':
                reader.readAsDataURL(blob);
                break;
            default:
                resolve(null);
                break;
        }
    });
}
function readArrayBuffer(arraybuffer, type,options) {
    const dataView = new DataView(arraybuffer);
    switch(type) {
        case 'string':
            const decoder = new TextDecoder(options.decodeType||'utf-8');
            return decoder.decode(arraybuffer);
        case 'blob':
            return new Blob([arraybuffer],{type:options.blobType||''});
        case 'url':
            const url = URL.createObjectURL(new Blob([arraybuffer]));
            return url;
        case 'dataView':
            return dataView;
        case 'int8':
            const int8Array = new Int8Array(arraybuffer);
            return int8Array;

        case 'int16':
            const int16Array = new Int16Array(arraybuffer);
            return int16Array;

        case 'int32':
            const int32Array = new Int32Array(arraybuffer);
            return int32Array;

        case 'uint8':
            const uint8Array = new Uint8Array(arraybuffer);
            return uint8Array;

        case 'uint16':
            const uint16Array = new Uint16Array(arraybuffer);
            return uint16Array;

        case 'uint32':
            const uint32Array = new Uint32Array(arraybuffer);
            return uint32Array;

        case 'float32':
            const float32Array = new Float32Array(arraybuffer);
            return float32Array;

        case 'float64':
            const float64Array = new Float64Array(arraybuffer);
            return float64Array;

        default:
            return null;
    }
}
function encodeToBinary(data,dataType,{type}) {
    if (dataType === "blob") {
        return new Blob([data],{type:type});
    } else if (dataType === "arraybuffer") {
        return new ArrayBuffer(data);
    } else if (dataType === "TypedArray") {
        switch (type) {
            case "Int8Array":
                return Int8Array.from(data);
            case "Uint8Array":
                return  Uint8Array.from(data);
            case "Uint8ClampedArray":
                return Uint8ClampedArray.from(data);
            case "Int16Array":
                return  Int16Array.from(data);
            case "Uint16Array":
                return  Uint16Array.from(data);
            case "Int32Array":
                return Int32Array.from(data);
            case "Uint32Array":
                return Uint32Array.from(data);
            case "Float32Array":
                return Float32Array.from(data);
            case "Float64Array":
                return Float64Array.from(data);
            case 'BigInt64Array':
                return BigInt64Array.from(data);
            case 'BigUint64Array':
                return BigUint64Array.from(data)
            default:
               return  Uint8Array.from(data)
        }
    } else {
        return  Uint8Array.from(data)
    }
}
export {readBlob,readArrayBuffer,encodeToBinary}
/*
const img=new Image();

const res=new Blob([img],{type:'image/png'})
readBlob(res,'arrayBuffer').then(res=> {
   /!* console.log(res);
    const decoder=new TextEncoder()
    console.log(decoder.encode(res));*!/
    console.log(readArrayBuffer(res, 'string'));
})
console.log(res);
/!*const blob=encodeData(img)
console.log(blob);*!/
/!*const win1251decoder = new TextDecoder("windows-1251");
const bytes = new Uint8Array([
    207, 240, 232, 226, 229, 242, 44, 32, 236, 232, 240, 33,
]);
console.log(win1251decoder.decode(bytes)); // Привет, мир!*!/
const bytes = new Uint8Array([
    207, 240, 232, 226, 229, 242, 44, 32, 236, 232, 240, 33,
])
console.log(readArrayBuffer(bytes.buffer,'uint8','windows-1251'));
console.log(encodeData('123', "blob",'text/plain'));*/
