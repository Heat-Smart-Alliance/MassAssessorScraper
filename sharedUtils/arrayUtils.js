/**
 * flat is a helper function that takes an array, and flattens it.
 *
 * Example: flat([1, [2, 3]], 1) returns [1, 2, 3]
 * Example: flat([1, [2, [3]]], 2) returns [1, 2, 3]
 *
 * @param arr - an array of objects to be flattened
 * @param d - the depth, defaulted to 1, in which the array should be flattened
 * @returns [{}] - an array of objects
 */
function flat(arr, depth = 1) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
    }, []);
}

/**
 * chunk takes an array, and splits it into an array of arrays.
 *
 * Example: chunk([1, 2, 3, 4, 5, 6], 2) returns [[1, 2], [3, 4], [5, 6]]
 *
 * @param arr - an array of objects to be chunked
 * @param chunkSize - the size of the nested arrays
 * @returns {[]} - an array of objects
 */
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