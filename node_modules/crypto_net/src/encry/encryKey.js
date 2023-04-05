/*method: 一个字符串，表示生成密钥的方法。可以是 generate、derive、unwrap 或 import 中的任意一个。
algorithm: 一个对象，描述密钥的加密算法。具体结构取决于具体的加密库和算法，一般包括算法名称和参数等信息。
extractable: 一个布尔值，表示生成的密钥是否可导出。
usages: 一个数组，表示生成的密钥可用于哪些操作，例如加密、解密、签名等。
options: 一个对象，包含不同方法所需的额外参数。具体结构也取决于具体的加密库和算法，例如 deriveAlgorithm、baseKey、format、wrappedKey、unwrappingKey、keyData 等。*/
function getEncryKey(method, algorithm, extractable, usages, options) {
    let keyPromise;
    switch (method) {
        case 'generate':
            keyPromise = crypto.subtle.generateKey(algorithm, extractable, usages);
            break;
        case 'derive':
            keyPromise = crypto.subtle.deriveKey(
                options.deriveAlgorithm,
                options.baseKey,
                algorithm,
                extractable,
                usages
            );
            break;
        case 'unwrap':
            keyPromise = crypto.subtle.unwrapKey(
                options.format,
                options.wrappedKey,
                options.unwrappingKey,
                algorithm,
                extractable,
                usages
            );
            break;
        case 'import':
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
export {getEncryKey}