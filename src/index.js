import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const titles = [
  '*NSYNC',
  'Ace of Base',
  'Alanis Morissette',
  'Anastacia',
  'Aqua',
  'Bloodhound Gang',
  'Bomfunk MC\'s',
  'Bon Jovi',
  'Britney Spears',
  'Christina Aguilera',
  'Céline Dion',
  'Darude',
  'Eiffel 65',
  'Five',
  'GES',
  'Haddaway',
  'Hanson',
  'Jennifer Lopez',
  'Leila K',
  'Lenny Kravitz',
  'Lisa Nilsson',
  'Magnus Uggla',
  'Markoolio',
  'Mauro Scocco',
  'Paradisio',
  'Petter',
  'Robyn',
  'Roxette',
  'S Club 7',
  'Shaggy',
  'Shakira',
  'Spice Girls',
  'Steps',
  'The Cardigans',
  'The Offspring',
  'TLC',
  'Toni Braxton',
  'Vengaboys',
  'Wheatus'
];

function generateRandomContent(usedNums) {
	let newNum;
	do {
		newNum = Math.floor(Math.random() * Math.floor(titles.length));
	}
	while (usedNums[newNum]);

	usedNums[newNum] = true;
  if (titles[newNum]) {
    return <div className="title">{titles[newNum]}</div>;
  }
  return <div className="free">★ FREE ★</div>;
}

function generateTiles(usedNums) {
  let markup = [];
  for (let i = 0; i < 25; ++i) {
    markup.push(
      <div className="tile" key={i}>
        {generateRandomContent(usedNums)}
      </div>
    );
  }
  return markup;
}

function Card() {
  const usedNums = new Array(titles.length);
  return <div className="card">{generateTiles(usedNums)}</div>;
}

function generateCards(numberOfCards, edition) {
  let markup = [];
  for (let i = 0; i < numberOfCards; ++i) {
    markup.push(
      <div key={i}>
        <h1>Music BINGO</h1>
        <h2>{edition} Edition</h2>
        <Card />
        <div className="page-break" />
      </div>
    );
  }
  return markup;
}

function App() {
  const [generateCard, setGenerateCard] = useState(false);
  const [edition, setEdition] = useState("");
  const [numberOfCards, setNumberOfCards] = useState(1);
  return (
    <div className="App">
      {generateCard ? (
        <div>{generateCards(numberOfCards, edition)}</div>
      ) : (
        <div>
          <h1>Music BINGO</h1>
          <label htmlFor="edition">Type of Bingo</label>
          <input id="edition" className="input" type="text" onChange={e => setEdition(e.target.value)} />
          <label htmlFor="number-of-cards">Number of Unique Cards to Generate</label>
          <input
            id="number-of-cards"
            className="input"
            type="number"
            placeholder={numberOfCards}
            onChange={e => setNumberOfCards(e.target.value)}
          />
          <button onClick={() => setGenerateCard(true)}>
            Generate {numberOfCards} cards
          </button>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
