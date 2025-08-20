import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import './App.css';
import Spotify from './util/Spotify'

const tracks = [
  {
    name: 'Song Name',
    artist: 'Artist',
    album: 'Album',
    id: 0
  },
  {
    name: 'Song Name',
    artist: 'Artist',
    album: 'Album',
    id: 1
  },
  {
    name: 'Song Name',
    artist: 'Artist',
    album: 'Album',
    id: 3
  },
  {
    name: 'Song Name',
    artist: 'Artist',
    album: 'Album',
    id: 4
  }
];



function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [toExport, setToExport] = useState([]);


  const search = async (term) => {
    try{
      const results = await Spotify.search(term);
      console.log(results)
      setSearchResults(results || []);
    }catch(error) {
      console.error('Search Failed')
      setSearchResults([])
    }
  }


  const addTrack = track => {
    setPlaylist(prev => (prev.some(t => t.id === track.id) ? prev: [...prev, track]));
    setSearchResults(prev => prev.filter(t => t.id !== track.id));
  }

  const removeTrack = track => {
    setPlaylist(prev => prev.filter(t => t.id !== track.id));
  }

  const exportPlaylist = () => {
    setToExport(playlist.map(track => track.uri))
  }
  

  return (
    <div className='body'>
      <div className='header'>
        <h1 className='header-title'>JAMMING</h1>
        <div className='search-bar'>
          <SearchBar onSearch={search}/>
        </div>
      </div>
      <div className='song-lists'>
        <div className='results'>
          <SearchResults tracks={searchResults}
           onAdd={addTrack}/>
        </div>
        <div className='playlist'>
          <Playlist tracks={playlist}
          onRemove={removeTrack}
          onExport={exportPlaylist}/>
        </div>
      </div>

    </div>
  )
}

export default App;