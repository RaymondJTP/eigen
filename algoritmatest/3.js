function matchingWords(input, query) {
    if (input.length == 0 || query.length == 0) {
        return "Masukkan data input dan query berupa array"
    }
    let result = [];
    for (let i = 0; i < query.length; i++) {
        const filteredInput = input.filter(el => el === query[i]);
        if (filteredInput.length > 0) {
            result[i] = filteredInput.length;
        } else {
            result[i] = 0;
        }
    }
    return result
}
let dataInput = ['xc', 'dz', 'bbb', 'dz'];
let dataQuery = ['bbb', 'ac', 'dz'];
console.log(matchingWords(dataInput, dataQuery));