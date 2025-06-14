import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MangaCard.css';
import { useMangaContext } from '../contexts/MangaContext';

const MangaCard = ({ manga }) => {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMangaContext();
  const favorite = isFavorite(manga.id);

  const title = manga.attributes?.title?.en || 'Untitled';
  const year = manga.attributes?.year || 'N/A';

  // Find the related cover_art object
  const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
  const fileName = coverArt?.attributes?.fileName;

  // Construct the full cover image URL
  const coverUrl = fileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
    : 'https://via.placeholder.com/256x400?text=No+Cover';

  const onFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click when clicking favorite button
    favorite ? removeFromFavorites(manga.id) : addToFavorites(manga);
  };

  const onCardClick = () => {
    navigate(`/manga/${manga.id}`);
  };

  return (
    <div className="movie-card" onClick={onCardClick}>
      <div className="movie-poster">
        <img src={coverUrl} alt={title} />
        <p>{coverUrl}</p>
        <div className="movie-overlay">
          <button className={`favorite-btn ${favorite ? 'active' : ''}`} onClick={onFavoriteClick}>
            ♥
          </button>
        </div>
      </div>

      <div className="movie-info">
        <h3>{title}</h3>
        <p>{year}</p>
      </div>
    </div>
  );
};

export default MangaCard;