const express = require('express');
const novelService = require('./services/novelService');
const arcService = require('./services/arcService');
const chapterService = require('./services/chapterService');
const memoryService = require('./services/memoryService');
const logger = require('./utils/logger');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health Check
app.get('/health', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      engineMode: 'GENRE_AGNOSTIC_SaaS_READY',
      models: {
        structure: 'qwen2.5:7b-q4_k_m',
        emotion: 'llama3:8b-q4_k_m'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Initialize Novel
app.post('/novel/init', async (req, res) => {
  try {
    const novelData = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'theme', 'genre', 'tone', 'worldRules', 'mainCharacter', 'totalChapters'];
    for (const field of requiredFields) {
      if (!novelData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Create novel
    const novel = await novelService.createNovel(novelData);
    
    // Generate arcs
    const arcs = await arcService.generateArcs(novel);
    
    // Initialize memory
    await memoryService.initializeMemory(novel.id);
    
    logger.info(`Novel initialized: ${novel.id} - ${novel.title}`);
    
    res.status(201).json({
      success: true,
      message: 'Novel initialized successfully',
      data: {
        novel,
        arcs
      }
    });
  } catch (error) {
    logger.error('Novel initialization failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Novel initialization failed',
      error: error.message
    });
  }
});

// Update Novel Theme
app.put('/novel/:id/update-theme', async (req, res) => {
  try {
    const { id } = req.params;
    const themeData = req.body;
    
    const updatedNovel = await novelService.updateNovelTheme(id, themeData);
    
    res.json({
      success: true,
      message: 'Novel theme updated successfully',
      data: updatedNovel
    });
  } catch (error) {
    logger.error(`Theme update failed for novel ${req.params.id}`, { error: error.message });
    res.status(404).json({
      success: false,
      message: 'Novel not found or update failed',
      error: error.message
    });
  }
});

// Generate Chapter
app.post('/novel/:id/generate/:chapterNumber', async (req, res) => {
  try {
    const { id, chapterNumber } = req.params;
    const chapterNum = parseInt(chapterNumber);
    
    // Extract SaaS parameters from request body
    const options = req.body || {};
    
    // Validate chapter number
    const novel = await novelService.getNovelById(id);
    if (chapterNum < 1 || chapterNum > novel.totalChapters) {
      return res.status(400).json({
        success: false,
        message: `Chapter number must be between 1 and ${novel.totalChapters}`
      });
    }
    
    if (chapterNum <= novel.currentChapter) {
      return res.status(400).json({
        success: false,
        message: `Chapter ${chapterNum} already exists`
      });
    }
    
    const result = await chapterService.generateChapter(id, chapterNum, options);
    
    res.json(result);
  } catch (error) {
    logger.error(`Chapter generation failed for novel ${req.params.id}`, { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Chapter generation failed',
      error: error.message
    });
  }
});

// Get Novel Status
app.get('/novel/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    
    const status = await chapterService.getChapterStatus(id);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error(`Status retrieval failed for novel ${req.params.id}`, { error: error.message });
    res.status(404).json({
      success: false,
      message: 'Novel not found',
      error: error.message
    });
  }
});

// Get All Novels
app.get('/novels', async (req, res) => {
  try {
    const novels = await novelService.getAllNovels();
    
    res.json({
      success: true,
      data: novels
    });
  } catch (error) {
    logger.error('Failed to retrieve novels', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve novels',
      error: error.message
    });
  }
});

// Get Novel by ID
app.get('/novel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const novel = await novelService.getNovelById(id);
    
    res.json({
      success: true,
      data: novel
    });
  } catch (error) {
    logger.error(`Failed to retrieve novel ${req.params.id}`, { error: error.message });
    res.status(404).json({
      success: false,
      message: 'Novel not found',
      error: error.message
    });
  }
});

// Get Chapter
app.get('/novel/:id/chapter/:chapterNumber', async (req, res) => {
  try {
    const { id, chapterNumber } = req.params;
    const chapterNum = parseInt(chapterNumber);
    
    const chapter = await chapterService.getChapter(id, chapterNum);
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: `Chapter ${chapterNum} not found`
      });
    }
    
    res.json({
      success: true,
      data: chapter
    });
  } catch (error) {
    logger.error(`Failed to retrieve chapter ${req.params.chapterNumber} for novel ${req.params.id}`, { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chapter',
      error: error.message
    });
  }
});

// Get Arcs
app.get('/novel/:id/arcs', async (req, res) => {
  try {
    const { id } = req.params;
    const arcs = await arcService.getArcs(id);
    
    res.json({
      success: true,
      data: arcs
    });
  } catch (error) {
    logger.error(`Failed to retrieve arcs for novel ${req.params.id}`, { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve arcs',
      error: error.message
    });
  }
});

// Get Memory
app.get('/novel/:id/memory', async (req, res) => {
  try {
    const { id } = req.params;
    const memory = await memoryService.getMemory(id);
    
    res.json({
      success: true,
      data: memory
    });
  } catch (error) {
    logger.error(`Failed to retrieve memory for novel ${req.params.id}`, { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve memory',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('Ollama WebNovel Engine - Genre-Agnostic SaaS Platform running on http://localhost:3000');
  logger.info('Server started', { port: PORT });
});