const BASE_URL = import.meta.env.VITE_BASE_URL;

// Yuri genre tag (covers both Yuri & Shoujo Ai in MangaDex)
const yuriTagId = 'b13b2a48-c720-44a9-9c77-39c9979373fb';

/**
 * Fetch Yuri manga including NSFW
 */
export const getYuriManga = async (offset = 0, limit = 50) => {
  const response = await fetch(
    `${BASE_URL}/manga?includes[]=cover_art&limit=${limit}&offset=${offset}&includedTags[]=${yuriTagId}&order[followedCount]=desc`
  );
  const data = await response.json();
  return {
    manga: data.data,
    total: data.total
  };
};

// Search Manga by Title
export const searchManga = async (query) => {
  const response = await fetch(
    `${BASE_URL}/manga?includes[]=cover_art&title=${encodeURIComponent(query)}&limit=50`
  );
  const data = await response.json();
  return data.data;
};

export const getMangaById = async (mangaId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching manga details:', error);
    throw error;
  }
};

// Fetch manga statistics (ratings, bookmarks, comments)
export const getMangaStatistics = async (mangaId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/statistics/manga/${mangaId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.statistics[mangaId];
  } catch (error) {
    console.error('Error fetching manga statistics:', error);
    throw error;
  }
};