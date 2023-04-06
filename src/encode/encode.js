// Description: This file contains the functions to encode and decode the string
function encodeStr(str, encoding) {
    switch (encoding) {
        case 'utf-16':
            const codePoints = [];
            for(let i=0;i<str.length;i++){
                codePoints.push(str.codePointAt(i));
            }
            return codePoints;
            case 'utf-8':
                const encoder=new TextEncoder();
                return encoder.encode(str);
    }
}
function decodeCodePoints(coePoints,encoding) {
    if(encoding==='utf-16'){
        let str='';
        for(let i=0;i<codePoints.length;i++){
            str+=String.fromCodePoint(codePoints[i]);
        }
        return str;
    }
   const decoder=new TextDecoder(encoding);
    return decoder.decode(codePoints);
}

console.log(encodeStr('A是！', 'utf-16'));
export {encodeStr,decodeCodePoints}
