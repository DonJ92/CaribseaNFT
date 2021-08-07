import base64 from 'base-64';
import utf8 from 'utf8';

function encode(str) {
    return base64.encode(utf8.encode(str));
}

function decode(str) {
    return utf8.decode(base64.decode(str));
}

export default {
    encode,
    decode
}