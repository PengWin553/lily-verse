const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);

  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'Server error';
    throw new Error(`${context}: ${message}`);
  } else if (error.request) {
    // Request made but no response received
    throw new Error(`${context}: Network error - please check your connection`);
  } else {
    // Something else happened
    throw new Error(`${context}: ${error.message}`);
  }
};

export const getYuriManga = async (offset = 0, limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/manga/yuri?offset=${offset}&limit=${limit}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      manga: data.manga || [],
      total: data.total || 0,
      limit: data.limit || limit,
      offset: data.offset || offset
    };
  } catch (error) {
    handleApiError(error, 'getYuriManga');
  }
};

export const searchManga = async (query, limit = 50) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const response = await fetch(`${API_BASE_URL}/api/manga/search?q=${encodedQuery}&limit=${limit}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, 'searchManga');
  }
};

export const getMangaById = async (id) => {
  try {
    if (!id) {
      throw new Error('Manga ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/api/manga/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Manga not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, 'getMangaById');
  }
};

export const getMangaStatistics = async (id) => {
  try {
    if (!id) {
      throw new Error('Manga ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/api/statistics/manga/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        // Statistics might not exist, return empty object
        return {};
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // For statistics, we can be more lenient with errors
    console.warn('Failed to fetch manga statistics:', error.message);
    return {}; // Return empty object instead of throwing
  }
};

// Health check function for debugging
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};