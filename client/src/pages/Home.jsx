import React, { useState, useEffect } from 'react';
import MangaCard from '../components/MangaCard';
import { getYuriManga, searchManga } from '../services/api';
import "../css/Home.css";
import searchIcon from '../assets/search.svg';

const LIMIT = 50;

const Home = () => {
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // pagination

  const offset = currentPage * LIMIT;

  const loadYuriManga = async (offset = 0) => {
    try {
      setLoading(true);
      const { manga, total } = await getYuriManga(offset);
      setMangaList(manga);
      setTotalResults(total);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load manga...");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const searchResults = await searchManga(searchQuery);
      setMangaList(searchResults);
      setTotalResults(searchResults.length); // For consistent UI
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to search manga...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      loadYuriManga(offset);
    }
  }, [offset, searchQuery]);

  const totalPages = Math.ceil(totalResults / LIMIT);

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search for manga..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === "") {
                setCurrentPage(0); // Reset to first page when query is cleared
              }
            }}
          />
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="movies-grid">
        {mangaList.map((manga) => (
          <MangaCard manga={manga} key={manga.id} />
        ))}
      </div>

      {!searchQuery && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;