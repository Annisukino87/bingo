import React from 'react';

const generateRandomContent = (usedNums, titles) => {
  let newNum;
  do {
    newNum = Math.floor(Math.random() * Math.floor(titles.length));
  } while (usedNums[newNum]);
  usedNums[newNum] = true;
  if (titles[newNum]) {
    return (
      <div
        className={titles[newNum].image ? 'tile has-cover' : 'tile'}
        key={newNum}
        style={{ backgroundImage: `url(${titles[newNum].image || ''})` }}
      >
        {titles[newNum].title && (
          <div className="title">{titles[newNum].title}</div>
        )}
      </div>
    );
  }
  return <div className="free">★ FREE ★</div>;
};

const generateTiles = (usedNums, titles) => {
  const markup = [];
  for (let i = 0; i < 25; ++i) {
    markup.push(generateRandomContent(usedNums, titles));
  }
  return markup;
};

export default function Card({ titles }) {
  const usedNums = new Array(titles.length);
  return <div className="card">{generateTiles(usedNums, titles)}</div>;
}
