import * as tsDom from 'dts-dom';

export const JAVA_TYPE_TS_MAP: Record<string, tsDom.Type> = {
    BOOLEAN: tsDom.type.boolean,
    BYTE: tsDom.type.number,
    CHAR: tsDom.type.string,
    DOUBLE: tsDom.type.number,
    FLOAT: tsDom.type.number,
    INT: tsDom.type.number,
    LONG: tsDom.type.number,
    SHORT: tsDom.type.number,
    STRING: tsDom.type.string,
    NUMBER: tsDom.type.number,
    JSON: tsDom.type.object,
    JSONARRAY: tsDom.type.array(tsDom.type.any),
};

const arrReg1 = /^LIST\s*?\<\s*?(\w*?)\s*?\>$/;
const arrReg2 = /^(\w*?)\s*?\[\s*?\]$/;


export function isArrType(name: string) {
    return arrReg1.test(name) || arrReg2.test(name);
}

export function getType(name: string): tsDom.Type {
    name = name.trim().toLocaleUpperCase();

    if (JAVA_TYPE_TS_MAP[name]) {
        return JAVA_TYPE_TS_MAP[name];
    }

    if (isArrType(name)) {
        return getArrayType(name);
    }

    return tsDom.type.any;
}

export function getArrayType(name: string): tsDom.Type {
    const getType = (match: null | string[]) => {
        if (Array.isArray(match)) {
            return tsDom.type.array(JAVA_TYPE_TS_MAP[match[1]] || tsDom.type.any);
        }

        return tsDom.type.any;
    };

    if (arrReg1.test(name)) { return getType(name.match(arrReg1)); }
    if (arrReg2.test(name)) { return getType(name.match(arrReg2)); }

    return tsDom.type.any;
}