import {utf16ToBase64} from "./base64.mjs";

function encodeData(data, encoding) {
    let encodedData;
    switch(encoding) {
        case "base64":
            encodedData = utf16ToBase64(data);
            break;
        case "ascii":
            encodedData = '';
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i).toString(2);
                encodedData += charCode.padStart(8, '0');
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
            encodedData = '';
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i).toString(16);
                encodedData += charCode.padStart(4, '0');
            }
            break;
        default:
            encodedData = data;
    }
    return encodedData;
}
export {encodeData}