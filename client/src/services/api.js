const BASE_URL = 'https://api.mangadex.org';

// Yuri genre tag (covers both Yuri & Shoujo Ai in MangaDex)
const yuriTagId = 'b13b2a48-c720-44a9-9c77-39c9979373fb';

/**
 * Fetch Yuri manga including NSFW
 */
export const getYuriManga = async () => {
  const response = await fetch(
    `${BASE_URL}/manga?includes[]=cover_art&limit=50&includedTags[]=${yuriTagId}&order[followedCount]=desc`
  );
  const data = await response.json();
  return data.data;
};

/**
 * Search any manga by title
 */
export const searchManga = async (query) => {
  const response = await fetch(
    `${BASE_URL}/manga?includes[]=cover_art&title=${encodeURIComponent(query)}&limit=50`
  );
  const data = await response.json();
  return data.data;
};