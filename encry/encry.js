function encry(plainText,algorithmn,key,options) {
    let data=plainText;
    if(!ArrayBuffer.isView(data)){
        if(options.format){
            switch (options.format){
                case 'arrayBuffer':
                    data=new ArrayBuffer(data.length)
                    const dataView=new DataView(data)
                    for(let i=0;i<data.byteLength;i++){
                        dataView.setInt8(i,data[i])
                    }
                    break;
                case 'typedArray':
                    data=Uint8Array.from(data);
                    break;
                case 'DataView':
                    const buffer=new ArrayBuffer(data.length)
                    const dataview=new DataView(buffer)
                    for(let i=0;i<data.byteLength;i++){
                        dataview.setInt8(i,data[i])
                    }
                    data= dataview;
            }
        }else{
            data=Uint8Array.from(data)
        }
    }
    return window.crypto.subtle.encrypt(algorithmn,key,data)
}
function decry(cipherText,algorithmn,key){
    return window.crypto.subtle.decrypt(algorithmn,key,cipherText)
}
function sign(data,algorithmn,key){
    if(!ArrayBuffer.isView(data)){
        data=Uint8Array.from(data)
    }
    return window.crypto.subtle.sign(algorithmn,key,data)
}
function verify(signedData,signature,algorithmn,key){
    return window.crypto.subtle.verify(algorithmn,key,signature,signedData);
}
function generateDigest(algorithmn,data){
    if(!ArrayBuffer.isView(data)){
        data=Uint8Array.from(data);
    }
    return window.crypto.subtle.digest(algorithmn,data)
}
export {decry,sign,encry,verify,generateDigest}