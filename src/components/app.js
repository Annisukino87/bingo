import React, { useEffect, useState } from 'react';
import "../styles.css";


function App() {
  const [generateCard, setGenerateCard] = useState(false);
  const [edition, setEdition] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [numberOfCards, setNumberOfCards] = useState(parseInt(sessionStorage.getItem('numberOfCards'))||1);
  const [titles, setTitles] = useState([]);

  async function fetchPlaylist(token) {
    const request = new Request(`https://api.spotify.com/v1/playlists/${sessionStorage.getItem('playlistId')}/tracks`);
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const response = await fetch(request, { headers });
    if (response.ok) {
      const data = await response.json();
      const tracks = data.items || data.tracks.items || [];
      const artists = tracks.reduce((prev, curr) => {
        if (curr.track) {
          const artists = curr.track.artists.map(element => element.name);
          prev.push(artists.join(', '));
        }
        return prev;
      }, []);
      console.log(artists);
      setTitles(artists);
      setGenerateCard(true);
    } else {
      window.alert('Playlist not found');
    }
  }

  useEffect(() => {
    const token = window.location.hash.split('&')[0].split('=')[1];
    if (token) {
      sessionStorage.setItem('token', token);
      window.location.hash = '';
      fetchPlaylist(token);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('numberOfCards', numberOfCards);
  }, [numberOfCards]);

  return (
    <div className="App">
      {generateCard ? (
        <div>{generateCards(sessionStorage.getItem('numberOfCards'), edition, titles)}</div>
      ) : (
        <div>
          <h1>Spotify Playlist Bingo</h1>
          <form onSubmit={event => {
            event.preventDefault();
            const token = sessionStorage.getItem('token');
            if (token) {
              fetchPlaylist(token);
            } else {
              sessionStorage.setItem('playlistId', playlistId);
              sessionStorage.setItem('numberOfCards', numberOfCards);
              sessionStorage.setItem('edition', edition);
              window.location.href = 'https://accounts.spotify.com/authorize?client_id=c69113b713cb47f985377a26e7e9c3fa&response_type=token&redirect_uri=http://localhost:3000/';
            }
          }}>
            <label htmlFor="playlist-id">Playlist ID</label>
            <input id="playlist-id" className="input" type="text" onChange={e => setPlaylistId(e.target.value)} required/>
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
            <button type="submit">
              Generate {numberOfCards} cards
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function generateRandomContent(usedNums, titles) {
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

function generateTiles(usedNums, titles) {
  let markup = [];
  for (let i = 0; i < 25; ++i) {
    markup.push(
      <div className="tile" key={i}>
        {generateRandomContent(usedNums, titles)}
      </div>
    );
  }
  return markup;
}

function Card({ titles }) {
  const usedNums = new Array(titles.length);
  return <div className="card">{generateTiles(usedNums, titles)}</div>;
}

function generateCards(numberOfCards, edition, titles) {
  let markup = [];
  for (let i = 0; i < numberOfCards; ++i) {
    markup.push(
      <div key={i}>
        <h1>Music BINGO</h1>
        <h2>{edition} Edition</h2>
        <Card titles={titles}/>
        <div className="page-break" />
      </div>
    );
  }
  return markup;
}

export default App;