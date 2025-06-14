const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Base MANGADEX API URL
const MANGADEX_BASE_URL = 'https://api.mangadex.org';

// Routes

// Root route - welcome message
app.get('/', (req, res) => {
  res.json({ 
    message: 'Lilyverse Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      yuriManga: '/api/manga/yuri',
      searchManga: '/api/manga/search?q=<query>',
      mangaDetails: '/api/manga/<id>',
      mangaStats: '/api/statistics/manga/<id>'
    }
  });
});

// Get Yuri manga with pagination
app.get('/api/manga/yuri', async (req, res) => {
  try {
    const { offset = 0, limit = 50 } = req.query;
    
    const response = await axios.get(`${MANGADEX_BASE_URL}/manga`, {
      params: {
        'includes[]': 'cover_art',
        limit: parseInt(limit),
        offset: parseInt(offset),
        'includedTags[]': 'b13b2a48-c720-44a9-9c77-39c9979373fb', // Yuri tag ID
        'order[followedCount]': 'desc'
      }
    });

    res.json({
      manga: response.data.data,
      total: response.data.total,
      limit: response.data.limit,
      offset: response.data.offset
    });
  } catch (error) {
    console.error('Error fetching yuri manga:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch manga',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Search manga
app.get('/api/manga/search', async (req, res) => {
  try {
    const { q, limit = 50 } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(`${MANGADEX_BASE_URL}/manga`, {
      params: {
        'includes[]': 'cover_art',
        title: q.trim(),
        limit: parseInt(limit),
        'order[relevance]': 'desc'
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error searching manga:', error.message);
    res.status(500).json({ 
      error: 'Failed to search manga',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Get manga by ID
app.get('/api/manga/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${MANGADEX_BASE_URL}/manga/${id}`, {
      params: {
        'includes[]': 'cover_art'
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching manga details:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Manga not found' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch manga details',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Get manga statistics
app.get('/api/statistics/manga/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${MANGADEX_BASE_URL}/statistics/manga/${id}`);

    res.json(response.data.statistics[id] || {});
  } catch (error) {
    console.error('Error fetching manga statistics:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Statistics not found' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch manga statistics',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// For Vercel serverless functions
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
}

// Export for Vercel
module.exports = app;