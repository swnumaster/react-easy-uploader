function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
export function genUniqueId() {    // not a real uid, but in this case, enough
    return S4() + S4() + S4() + S4();
}

export function deepcopyArray(originArray) {
    return originArray.slice(0);
}