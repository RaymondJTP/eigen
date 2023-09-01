function longest(words) {
    if (!words) {
        return 'Silahkan masukkan kalimat yang ingin dianalisa'
    }
    let wordsArray = words.split(' ');
    let temp = 0;
    let wordIndex = 0;
    for (let i = 0; i< wordsArray.length; i++) {
        if (wordsArray[i].length > temp) {
            temp = wordsArray[i].length;
            wordIndex = i;
        }
    }
    return `${wordsArray[wordIndex]}: ${temp} karakter`;

}

const sentence = "Saya sangat senang mengerjakan soal algoritma"
console.log(longest(sentence));