import data from "../data/words.json" with { type: "json" };

const generateWord = () => {
  let randomIndex = Math.floor(Math.random() * data.length);

  return data[randomIndex];
};
