import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaById, getMangaStatistics } from '../services/api';
import { useMangaContext } from '../contexts/MangaContext';
import '../css/MangaDetail.css';

const MangaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMangaContext();
  
  const [manga, setManga] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch both manga details and statistics in parallel
        const [mangaData, statsData] = await Promise.all([
          getMangaById(id),
          getMangaStatistics(id)
        ]);
        
        setManga(mangaData);
        setStatistics(statsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching manga details:', err);
        setError('Failed to load manga details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMangaDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="manga-detail">
        <div className="loading">Loading manga details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manga-detail">
        <div className="error">{error}</div>
        <button onClick={() => navigate(-1)} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="manga-detail">
        <div className="error">Manga not found</div>
        <button onClick={() => navigate(-1)} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  const title = manga.attributes?.title?.en || 'Untitled';
  const description = manga.attributes?.description?.en || 'No description available';
  const year = manga.attributes?.year || 'N/A';
  const status = manga.attributes?.status || 'Unknown';
  const tags = manga.attributes?.tags || [];
  const contentRating = manga.attributes?.contentRating || 'Not specified';

  // Find the related cover_art object
  const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
  const fileName = coverArt?.attributes?.fileName;

  // Construct the full cover image URL
  const coverUrl = fileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
    : 'https://via.placeholder.com/400x600?text=No+Cover';

  const favorite = isFavorite(manga.id);

  const onFavoriteClick = () => {
    favorite ? removeFromFavorites(manga.id) : addToFavorites(manga);
  };

  // Format statistics with fallbacks
  const rating = statistics?.rating ? {
    average: statistics.rating.average?.toFixed(2) || 'N/A',
    bayesian: statistics.rating.bayesian?.toFixed(2) || 'N/A'
  } : null;
  
  const follows = statistics?.follows || 0;

  return (
    <div className="manga-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>
      
      <div className="manga-detail-content">
        <div className="manga-cover-section">
          <img src={coverUrl} alt={title} className="manga-cover-large" />
          <button 
            className={`favorite-btn-large ${favorite ? 'active' : ''}`} 
            onClick={onFavoriteClick}
          >
            {favorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
          </button>
        </div>
        
        <div className="manga-info-section">
          <h1 className="manga-title">{title}</h1>
          
          <div className="manga-meta">
            <div className="meta-item">
              <strong>Year:</strong> {year}
            </div>
            <div className="meta-item">
              <strong>Status:</strong> {status}
            </div>
            <div className="meta-item">
              <strong>Content Rating:</strong> {contentRating}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="manga-statistics">
            <div className="stats-row">
              <div className="stat-item">
                <strong>Rating:</strong> 
                <span className="stat-value">
                  {rating ? `${rating.average}/10` : 'N/A'}
                </span>
                {rating && (
                  <span className="stat-subtitle">
                    (Bayesian: {rating.bayesian}/10)
                  </span>
                )}
              </div>
              <div className="stat-item">
                <strong>Bookmarks:</strong> 
                <span className="stat-value">{follows.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="manga-tags">
              <strong>Tags:</strong>
              <div className="tags-list">
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag.attributes?.name?.en || tag.attributes?.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="manga-description">
            <h3>Description</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;