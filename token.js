const crypto = require('crypto')
const config = require("./configs/config.json")
const appId = config.appId;
const secretKey = config.secretKey;


function generateJWT() {

    const toBase64 = obj => {
        const str = JSON.stringify(obj);
        return Buffer.from(str).toString('base64');
    };

    const replaceSpecialChars = b64string => {
        return b64string.replace(/[=+/]/g, charToBeReplaced => {
            switch (charToBeReplaced) {
                case '=':
                    return '';
                case '+':
                    return '-';
                case '/':
                    return '_';
            }
        });
    };


    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const b64Header = toBase64(header);
    const jwtB64Header = replaceSpecialChars(b64Header);

    const payload = {
        appId: appId
    };
    const b64Payload = toBase64(payload);
    const jwtB64Payload = replaceSpecialChars(b64Payload);

    const createSignature = (jwtB64Header, jwtB64Payload, secret) => {
        let signature = crypto.createHmac('sha256', secret);
        signature.update(jwtB64Header + '.' + jwtB64Payload);
        signature = signature.digest('base64');
        signature = replaceSpecialChars(signature);
        return signature
    }
    const secret = secretKey;
    const signature = createSignature(jwtB64Header, jwtB64Payload, secret);
    //console.log(jwtB64Header + '.' + jwtB64Payload + '.' + signature)
    return jwtB64Header + '.' + jwtB64Payload + '.' + signature
}
generateJWT();
module.exports = generateJWT;