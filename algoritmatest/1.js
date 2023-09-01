function reverse(word) {
    let result = '';
    let numberInString;
    for(let i = word.length-1; i >= 0; i--) {
        if(isNaN(Number(word[i])) == true) result += word[i];
        else numberInString = word[i];
        
    }
    return numberInString ? result + numberInString : result;
}

let wordForReversed = 'NEGIE1';
console.log(reverse(wordForReversed));