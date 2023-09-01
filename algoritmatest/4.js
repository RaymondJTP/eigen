function matrixSum(matrix) {
    let leftMatrix = 0;
    let rightMatrix = 0;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix.length !== matrix[j].length) {
                return 'Masukkan array dimensional yang sama sisi'
            }
            if (i == j) {
                leftMatrix += matrix[i][j];
            }

            if (i + j == matrix.length - 1) {
                rightMatrix += matrix[i][j];
            }
        }   
    }
    return leftMatrix - rightMatrix;
}

let dataMatrix = [
    [1, 2, 0], 
    [4, 5, 6], 
    [7, 8, 9],
    
];
console.log(matrixSum(dataMatrix));
