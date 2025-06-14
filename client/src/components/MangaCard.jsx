import React, { useState } from 'react';
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
  const originalCoverUrl = fileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
    : null;

  // Use proxy URL for MangaDex images
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const coverUrl = originalCoverUrl
    ? `${API_BASE_URL}/api/proxy-image?url=${encodeURIComponent(originalCoverUrl)}`
    : 'https://via.placeholder.com/256x400?text=No+Cover';

  // State for handling image loading
  const [imgSrc, setImgSrc] = useState(coverUrl);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.warn('Failed to load image:', imgSrc);
    setImageError(true);
    setImgSrc('https://via.placeholder.com/256x400?text=No+Cover');
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

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
        <img 
          src={imgSrc} 
          alt={title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            opacity: imageLoaded ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
            filter: imageError ? 'none' : 'none'
          }}
        />
        {!imageLoaded && !imageError && (
          <div className="loading-placeholder" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '14px'
          }}>
            Loading...
          </div>
        )}
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