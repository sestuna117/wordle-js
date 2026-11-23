import data from "../data/words.json" with { type: "json" };

const enterKey = document.getElementById("enter-key");
const gameBoard = document.getElementById("game-board");

const MAX_GUESSES = 6;
const LETTER_COUNT = 5;

let originalWord = "wordle";
let currentGuessIndex = 0;

const generateWord = () => {
  let randomIndex = Math.floor(Math.random() * data.length);

  return data[randomIndex];
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
  originalWord = generateWord();
  // seperate word into map of letters which index and counts
  // initialize the guessing matrix
  initializeBoard();
};

const generateCurrentIndexRegex = () => {
  return new RegExp(`${currentGuessIndex}-`, "gi");
};

const checkGuess = () => {
  // get original word
  console.log("checking guess");
  // convert guess into map
  let inputs = document.querySelectorAll("#game-board > * > [id]");

  let regex = generateCurrentIndexRegex();
  const currentGuessInputs = [...inputs].filter((input) =>
    input.id.match(regex),
  );
  console.log(currentGuessInputs);
  const currentGuessStr = currentGuessInputs
    .map((input) => input.value)
    .join("")
    .toLowerCase();
  console.log(currentGuessStr);

  if (currentGuessStr === originalWord) {
    alert("you guessed the word!");
  }
  // compare original map with guess map
  // mark differences if they exist
  // disable current row, enable new row
  for (let i = 0; i < currentGuessInputs.length; i++) {
    currentGuessInputs[i].disabled = true;
  }
  currentGuessIndex++;

  if (currentGuessIndex >= MAX_GUESSES) {
    alert("you've run out of guesses");
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
  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    // event listener to move to next field based on input value and index
    inputs[i].addEventListener("keyup", function (event) {
      if (
        event.key === "Enter" &&
        (i + 1) % 5 === 0 &&
        inputs[i].value !== ""
      ) {
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
