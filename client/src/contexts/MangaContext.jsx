import { createContext, useState, useContext, useEffect } from "react";

const MangaContext = createContext();
export const useMangaContext = () => useContext(MangaContext);

export const MangaProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("favorites");
      if (storedFavs) {
        const parsedFavs = JSON.parse(storedFavs);
        setFavorites(parsedFavs);
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites, isLoading]);

  const addToFavorites = (manga) => {
    setFavorites((prev) => {
      // Check if already exists to prevent duplicates
      if (prev.some(m => m.id === manga.id)) {
        return prev;
      }
      return [...prev, manga];
    });
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
    isLoading,
  };

  return <MangaContext.Provider value={value}>{children}</MangaContext.Provider>;
};