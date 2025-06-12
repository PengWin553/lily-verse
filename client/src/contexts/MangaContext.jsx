import { createContext, useState, useContext, useEffect } from "react";

const MangaContext = createContext();
export const useMangaContext = () => useContext(MangaContext);

export const MangaProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (manga) => {
    setFavorites((prev) => [...prev, manga]);
  };

  const removeFromFavorites = (mangaId) => {
    setFavorites((prev) => prev.filter((m) => m.id !== mangaId));
  };

  const isFavorite = (mangaId) => {
    return favorites.some((m) => m.id === mangaId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return <MangaContext.Provider value={value}>{children}</MangaContext.Provider>;
};