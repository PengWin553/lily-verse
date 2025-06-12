import React, { useState, useEffect } from 'react';
import MangaCard from '../components/MangaCard';
import { getYuriManga, searchManga } from '../services/api';
import "../css/Home.css";

const Home = () => {
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;
    setLoading(true);

    try {
      const searchResults = await searchManga(searchQuery);
      setMangaList(searchResults);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to search manga...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadYuriManga = async () => {
      try {
        const yuriManga = await getYuriManga();
        setMangaList(yuriManga);
      } catch (err) {
        console.error(err);
        setError("Failed to load manga...");
      } finally {
        setLoading(false);
      }
    };

    loadYuriManga();
  }, []);

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for manga..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="movies-grid">
        {mangaList.map((manga) => {
          const title = manga.attributes.title.en || "";
          return (
            (!searchQuery || title.toLowerCase().startsWith(searchQuery.toLowerCase())) && (
              <MangaCard manga={manga} key={manga.id} />
            )
          );
        })}
      </div>
    </div>
  );
};

export default Home;