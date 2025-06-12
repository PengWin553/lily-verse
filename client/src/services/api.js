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