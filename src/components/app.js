import React, { useEffect, useState } from 'react';
import '../styles.css';

function App() {
  const [generateCard, setGenerateCard] = useState(false);
  const [edition, setEdition] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [numberOfCards, setNumberOfCards] = useState(
    parseInt(sessionStorage.getItem('numberOfCards')) || 1
  );
  const [titles, setTitles] = useState([]);
  const [tileTitle, setTileTitle] = useState('artist');
  const [showCovers, setShowCovers] = useState(false);

  async function fetchPlaylist(token) {
    const request = new Request(
      `https://api.spotify.com/v1/playlists/${sessionStorage.getItem(
        'playlistId'
      )}/tracks`
    );
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const response = await fetch(request, { headers });
    if (response.ok) {
      const data = await response.json();
      const tracks = data.items || data.tracks.items || [];
      const artists = tracks.reduce((prev, curr) => {
        if (curr.track) {
          const foo = {};
          if (tileTitle !== 'no-title') {
            if (tileTitle === 'track') {
              foo.title = curr.track.name;
            } else {
              const artists = curr.track.artists.map((element) => element.name);
              foo.title = artists.join(', ');
            }
          }
          if (showCovers) {
            foo.image =
              (curr.track.album &&
                curr.track.album.images &&
                curr.track.album.images &&
                curr.track.album.images[0].url) ||
              '';
          }
          prev.push(foo);
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
    const id = sessionStorage.getItem('playlistId');
    if (id) {
      setPlaylistId(id);
    }
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

  function getPlaylistId(url) {
    // TODO: Check if url is valid
    const [, playlistId] = url.match(/playlist\/([^#?]+)/);
    setPlaylistId(playlistId);
  }

  return (
    <div className="App">
      {generateCard ? (
        <div>
          {generateCards(
            sessionStorage.getItem('numberOfCards'),
            edition,
            titles
          )}
        </div>
      ) : (
        <div>
          <h1>Spotify Playlist Bingo</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const token = sessionStorage.getItem('token');
              if (token) {
                fetchPlaylist(token);
              } else {
                sessionStorage.setItem('playlistId', playlistId);
                sessionStorage.setItem('numberOfCards', numberOfCards);
                sessionStorage.setItem('edition', edition);
                window.location.href =
                  'https://accounts.spotify.com/authorize?client_id=c69113b713cb47f985377a26e7e9c3fa&response_type=token&redirect_uri=http://localhost:3000/';
              }
            }}
          >
            <label htmlFor="playlist-id">Playlist URL</label>
            <input
              id="playlist-id"
              className="input"
              onChange={(e) => getPlaylistId(e.target.value)}
              required
              value={playlistId}
            />
            <label htmlFor="edition">Type of Bingo</label>
            <input
              id="edition"
              className="input"
              type="text"
              onChange={(e) => setEdition(e.target.value)}
            />
            <label htmlFor="number-of-cards">
              Number of Unique Cards to Generate
            </label>
            <input
              id="number-of-cards"
              className="input"
              type="number"
              placeholder={numberOfCards}
              onChange={(e) => setNumberOfCards(e.target.value)}
            />
            <div>
              <select
                value={tileTitle}
                onChange={({ target }) => setTileTitle(target.value)}
              >
                <option value="no-title">--No title--</option>
                <option value="artist">Artist</option>
                <option value="track">Track</option>
              </select>
            </div>
            <div>
              <label>
                Show album cover:
                <input
                  name="showCovers"
                  type="checkbox"
                  checked={showCovers}
                  onChange={({ target }) => setShowCovers(target.checked)}
                />
              </label>
            </div>
            <button type="submit">Generate {numberOfCards} cards</button>
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
}

function generateTiles(usedNums, titles) {
  let markup = [];
  for (let i = 0; i < 25; ++i) {
    markup.push(generateRandomContent(usedNums, titles));
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
        <Card titles={titles} />
        <div className="page-break" />
      </div>
    );
  }
  return markup;
}

export default App;
