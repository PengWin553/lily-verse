import React from 'react'
import '../css/Favorites.css'
import { useMangaContext } from '../contexts/MangaContext'
import MangaCard from '../components/MangaCard'

const Favorites = () => {
  // Get the list of favorite Mangas from context
  const { favorites } = useMangaContext();

  // Render list of favorites if there are any
  if (favorites) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <div className="movies-grid">
          {favorites.map((manga) => (
            <MangaCard manga={manga} key={manga.id}/>
          ))}
        </div>
      </div>
    );
  }

  // Render empty state message
  return (
    <div className='favorites-empty'>
      <h2>No favorite manga yet.</h2>
      <p>Start adding manga to your favorites.</p>
    </div>
  );
}

export default Favorites