'use strict'
{
    function setWord(){
        // word = words[Math.floor(Math.random() * words.length)];
        word = words.splice(Math.floor(Math.random() * words.length), 1)[0];
        target.textContent = word;
        loc = 0;
    }

    function createWords(characters, word_length, words_length){
        let ch;
        let word;
        for(let j = 0; j < words_length; j++){
            word = '';
            for(let i = 0; i < word_length; i++){
                ch = characters[Math.floor(Math.random() * characters.length)];
                word += ch;
                // word += 'a';
            }
            words.push(word);
        }
    }

    const characters = [
        'abcdefghijklmnopqrstuvwxyz', //0
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', //1
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', //2
        '!"#$%&\'()-=^~¥|`@{[;+:*]},<.>/?_\\', //3
        '!"#$%&\'()-=^~¥|`@{[;+:*]},<.>/?_\\1234567890', //4
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!"#$%&\'()-=^~¥|`@{[;+:*]},<.>/?_\\', //5
        '\\', //6
    ]

    function dispWords(){
        for(let row = 0; row < words.length; row++){
            console.log(words[row]);
        }
    }


    const words = [];
    let word;
    let startTime;
    let loc = 0;
    let isPlaying = false;
    let isEnd = false;

    let PROBLEM_INDEX;
    let WORD_LENGTH;
    let WORDS_LENGTH;
    let TOTAL_CHARACTERS;

    var wrongWordFlag = false;
    var wrongCharacterFlag = false;
    var countCorrectWords = 0;
    var countCorrectCharacters = 0;

    var audioType = new Audio();
    var audioMiss = new Audio();
    audioType.src = "type.mp3";
    audioMiss.src = "miss.mp3";
    audioMiss.volume = 0.5;

    // dispWords();

    const target = document.getElementById('target');
    // document.addEventListener('click', () => {
    document.addEventListener('keydown', e => {
        //isPlaying: false, isEnd: false
        if(isPlaying === true || isEnd == true || e.key !== ' '){
            return;
        }
        var input = document.getElementById("input");
        PROBLEM_INDEX = Number(input.querySelector("input[name=problem_set]").value);
        // WORD_LENGTH = Number(input.querySelector("input[name=length_word]").value);
        WORD_LENGTH = 10;
        WORDS_LENGTH = Number(input.querySelector("input[name=total_problem]").value);
        if(!(PROBLEM_INDEX >= 0 && PROBLEM_INDEX <= 5)){
            audioMiss.currentTime = 0;
            audioMiss.play();
            return;
        }
        if(!(WORD_LENGTH >= 1 && WORD_LENGTH <= 20)){
            audioMiss.currentTime = 0;
            audioMiss.play();
            return;
        }
        if(!(WORDS_LENGTH >= 1 && WORDS_LENGTH <= 100)){
            audioMiss.currentTime = 0;
            audioMiss.play();
            return;
        }
        TOTAL_CHARACTERS = WORD_LENGTH * WORDS_LENGTH;
        input.style.display = "none";
        startTime = Date.now();
        isPlaying = true;
        createWords(characters[PROBLEM_INDEX], WORD_LENGTH, WORDS_LENGTH);
        setWord();
    });
    document.addEventListener('keydown', e => {
        //isPlaying: true, isEnd: false
        //early return
        if(isPlaying === false || isEnd == true){
            return;
        }
        if(e.key !== word[loc]){
            if(e.key !== "Shift" && e.key != " " && e.key != "Control" && e.key != "Meta" && e.key != "Alt" && e.key != "Tab"){
                wrongWordFlag = true;
                wrongCharacterFlag = true;
                // target.style.color = "red";
                audioMiss.currentTime = 0;
                audioMiss.play();
            }
            return;
        }
        target.style.color = "black";
        if(!(wrongCharacterFlag)){
            countCorrectCharacters++;
        }
        wrongCharacterFlag = false;
        audioType.currentTime = 0;
        audioType.play();
        loc++;
        target.textContent = ''.repeat(loc) + word.substring(loc);
        if(loc === word.length){
            if(!(wrongWordFlag)){
                countCorrectWords++;
            }
            wrongWordFlag = false;
            if(words.length === 0){
                const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
                const result = document.getElementById('result');
                //result.textContent = `Finished! ${elapsedTime} seconds!`;
                const correctWordsRatio = countCorrectWords / WORDS_LENGTH * 100;
                const correctCharactersRatio = countCorrectCharacters / TOTAL_CHARACTERS * 100;
                result.innerHTML = `Finished! ${elapsedTime} seconds!<br><br>` +
                `Number of correct words / total words: ${countCorrectWords} / ${WORDS_LENGTH} (${correctWordsRatio.toFixed(2)}%)<br><br>` +
                `Number of correct characters / total characters: ${countCorrectCharacters} / ${TOTAL_CHARACTERS} (${correctCharactersRatio.toFixed(2)}%)<br><br>` +
                 "<br><br> Press space key to reload!";
                isEnd = true;
                return;
            }
            setWord();
        }
    });
    document.addEventListener('keydown', e => {
        //isPlaying: true, isEnd: true
        if(isPlaying == false || isEnd === false || e.key !== ' '){
            return;
        }
        // location.reload();
        createWords(characters[PROBLEM_INDEX], WORD_LENGTH, WORDS_LENGTH);
        startTime = Date.now();
        isEnd = false;
        countCorrectCharacters = 0;
        countCorrectWords = 0;
        setWord();
        result.innerHTML = '';
    });




}
