import data from "../data/words.json" with { type: "json" };

const enterKey = document.getElementById("enter-key");
const gameBoard = document.getElementById("game-board");

const MAX_GUESSES = 6;
const LETTER_COUNT = 5;

let originalWord = "wordle";
let originalWordLetterMap = new Map();
let currentGuessRow = 0;

const generateMapFromWord = (word) => {
  const letterMap = new Map();

  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    if (!letterMap.has(char)) {
      letterMap.set(char, []);
    }

    const entry = letterMap.get(char);
    entry.push(i);
  }

  return letterMap;
};

// generates a random 5 char word and create a map of each letters count and index
const generateWord = () => {
  let randomIndex = Math.floor(Math.random() * data.length);

  originalWord = data[randomIndex];
  originalWordLetterMap = generateMapFromWord(originalWord);
};

const initializeBoard = () => {
  for (let i = 0; i < MAX_GUESSES; i++) {
    let row = document.createElement("div");
    for (let j = 0; j < LETTER_COUNT; j++) {
      let column = document.createElement("input");
      column.id = `${i}-${j}`;
      column.maxLength = 1;
      column.type = "text";
      if (i !== 0) {
        column.disabled = true;
      }
      row.appendChild(column);
    }
    gameBoard.appendChild(row);
  }
};

const initializeGame = () => {
  // generate a word
  generateWord();
  // seperate word into map of letters which index and counts
  // initialize the guessing matrix
  initializeBoard();
};

const generateCurrentIndexRegex = () => {
  return new RegExp(`${currentGuessRow}-`, "gi");
};

function getLetterByIndex(charMap, index) {
  for (let [letter, indices] of charMap.entries()) {
    if (indices.includes(index)) {
      return letter;
    }
  }
  return undefined;
}

const checkGuess = () => {
  let inputs = document.querySelectorAll("#game-board > * > [id]");
  let regex = generateCurrentIndexRegex();
  const currentGuessInputs = [...inputs].filter((input) =>
    input.id.match(regex),
  );
  const currentGuessStr = currentGuessInputs
    .map((input) => input.value)
    .join("")
    .toLowerCase();

  const currentGuessLetterMap = generateMapFromWord(currentGuessStr);
  const originalLetterMapCopy = structuredClone(originalWordLetterMap);
  for (let i = 0; i < currentGuessInputs.length; i++) {
    currentGuessInputs[i].disabled = true;
    const guessChar = getLetterByIndex(currentGuessLetterMap, i);
    const originalChar = getLetterByIndex(originalLetterMapCopy, i);

    if (guessChar === originalChar) {
      currentGuessInputs[i].className = "letter--correct";
      let newGuessIndices = currentGuessLetterMap
        .get(guessChar)
        .filter((index) => index !== i);
      let newOrigIndices = originalLetterMapCopy
        .get(originalChar)
        .filter((index) => index !== i);
      // remove chars from maps to help account for when there are duplicate
      // letters need to be check that have already been accounted for
      if (newGuessIndices.length === 0) {
        currentGuessLetterMap.delete(guessChar);
      } else {
        currentGuessLetterMap.set(guessChar, newGuessIndices);
      }
      if (newOrigIndices.length === 0) {
        originalLetterMapCopy.delete(originalChar);
      } else {
        originalLetterMapCopy.set(originalChar, newOrigIndices);
      }
    } else {
      if (originalLetterMapCopy.has(guessChar)) {
        currentGuessInputs[i].className = "letter--contains";
      } else {
        currentGuessInputs[i].className = "letter--incorrect";
      }
    }
  }

  if (currentGuessStr === originalWord) {
    alert("you guessed the word!");
    return;
  }

  currentGuessRow++;

  if (currentGuessRow >= MAX_GUESSES) {
    alert("you've run out of guesses");
    return;
  }

  regex = generateCurrentIndexRegex();
  const nextGuessInputs = [...inputs].filter((input) => input.id.match(regex));
  for (let i = 0; i < nextGuessInputs.length; i++) {
    nextGuessInputs[i].disabled = false;
    if (i === 0) {
      nextGuessInputs[i].focus();
    }
  }
};

function charInput() {
  const inputs = document.querySelectorAll("#game-board > * > [id]");
  for (let i = 0; i < inputs.length; i++) {
    // event listener to move to next field based on input value and index
    inputs[i].addEventListener("keydown", function (event) {
      event.preventDefault();
      if (
        event.key === "Enter" &&
        (i + 1) % 5 === 0 &&
        inputs[i].value !== ""
      ) {
        checkGuess();
      } else if (event.key === "Backspace") {
        inputs[i].value = "";
        if (i !== 0) inputs[i - 1].focus();
      } else if (event.key.match(/^[a-z]$/i)) {
        inputs[i].value = event.key;
        if ((i + 1) % 5 !== 0) inputs[i + 1].focus();
      }
    });
  }
}

initializeGame();
charInput();
console.log("Answer:", originalWord);
