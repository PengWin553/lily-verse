import React from 'react'
import '../css/Favorites.css'
import { useMovieContext } from '../contexts/MovieContext'
import MovieCard from '../components/MovieCard'

const Favorites = () => {
  // Get the list of favorite movies from context
  const { favorites } = useMovieContext();

  // Render list of favorites if there are any
  if (favorites) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id}/>
          ))}
        </div>
      </div>
    );
  }

  // Render empty state message
  return (
    <div className='favorites-empty'>
      <h2>No favorite movies yet.</h2>
      <p>Start adding movies to your favorites.</p>
    </div>
  );
}

export default Favorites