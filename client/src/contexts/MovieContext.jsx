import { createContext, useState, useContext, useEffect } from "react";

// Create the MovieContext
const MovieContext = createContext();

// Custom hook to consume MovieContext
export const useMovieContext = () => useContext(MovieContext);

// Provider component that wraps the app and provides movie-related state
export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add a movie to favorites
  const addToFavorites = (movie) => {
    setFavorites(prev => [...prev, movie]);
  };

  // Remove a movie from favorites
  const removeFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  // Check if a movie is in favorites
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  // Provide state and functions to the children
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};