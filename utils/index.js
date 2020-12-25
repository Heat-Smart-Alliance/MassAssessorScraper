function flat(arr, d = 1) {
    return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
        : arr.slice();
}

function chunk(arr, chunkSize) {
    if (chunkSize <= 0) throw "Invalid chunk size";
    let R = [];
    for (let i=0,len=arr.length; i<len; i+=chunkSize)
        R.push(arr.slice(i,i+chunkSize));
    return R;
}

module.exports = {
    flat,
    chunk
}