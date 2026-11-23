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
      row.appendChild(column);
    }
    gameBoard.appendChild(row);
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

function charInput() {
  const inputs = document.querySelectorAll("#game-board > * > [id]");
  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    // event listener to move to next field based on input value and index
    inputs[i].addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        checkGuess();
      } else if (event.key === "Backspace") {
        inputs[i].value = "";
        if (i !== 0) inputs[i - 1].focus();
      } else {
        if (event.target.value.match(/[a-z]/gi)) {
          inputs[i].value = String.fromCharCode(event.keyCode);
          if ((i + 1) % 5 !== 0) inputs[i + 1].focus();
          event.preventDefault();
        } else {
          inputs[i].value = "";
        }
      }
    });
  }
}

initializeGame();
charInput();
console.log(originalWord);
