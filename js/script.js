import data from "../data/words.json" with { type: "json" };

const enterKey = document.getElementById("enter-key");
const gameBoard = document.getElementById("game-board");

let originalWord = "wordle";
let guessesRemaining = 6;
let letterCount = 5;

const generateWord = () => {
  let randomIndex = Math.floor(Math.random() * data.length);

  return data[randomIndex];
};

const initializeBoard = () => {
  for (let i = 0; i < guessesRemaining; i++) {
    let row = document.createElement("div");
    for (let j = 0; j < letterCount; j++) {
      let column = document.createElement("input");
      column.id = `${i}-${j}`;
      column.maxLength = 1;
      column.type = "text";
      row.appendChild(column)
    }
    gameBoard.appendChild(row)
  }
};

const initializeGame = () => {
  // generate a word
  originalWord = generateWord();
  // seperate word into map of letters which index and counts
  // initialize the guessing matrix
  initializeBoard();
};

const checkGuess = () => {
  // get original word
  // convert guess into map
  // compare original map with guess map
  // mark differences if they exist
  // disable previous row, enable new row
};

initializeGame();
console.log(originalWord)
