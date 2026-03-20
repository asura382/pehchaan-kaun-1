const fs = require('fs-extra');
const path = require('path');
const logger = require('../utils/logger');

class NovelService {
  constructor() {
    this.novelsFile = path.join(__dirname, '../data/novels.json');
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.ensureDir(path.join(__dirname, '../data'));
      await fs.ensureDir(path.join(__dirname, '../data/memory'));
      await fs.ensureDir(path.join(__dirname, '../data/chapters'));
      await fs.ensureDir(path.join(__dirname, '../data/arcs'));
      
      if (!await fs.pathExists(this.novelsFile)) {
        await fs.writeJson(this.novelsFile, []);
      }
    } catch (error) {
      logger.error('Failed to ensure data directories', { error: error.message });
      throw error;
    }
  }

  async getAllNovels() {
    try {
      const novels = await fs.readJson(this.novelsFile);
      return novels;
    } catch (error) {
      logger.error('Failed to read novels', { error: error.message });
      throw new Error('Failed to retrieve novels');
    }
  }

  async getNovelById(id) {
    try {
      const novels = await this.getAllNovels();
      const novel = novels.find(n => n.id === id);
      if (!novel) {
        throw new Error(`Novel with id ${id} not found`);
      }
      return novel;
    } catch (error) {
      logger.error(`Failed to get novel ${id}`, { error: error.message });
      throw error;
    }
  }

  async createNovel(novelData) {
    try {
      const novels = await this.getAllNovels();
      
      const newNovel = {
        id: this.generateId(),
        title: novelData.title,
        theme: novelData.theme,
        genre: novelData.genre,
        tone: novelData.tone,
        worldRules: novelData.worldRules,
        mainCharacter: novelData.mainCharacter,
        sideCharacters: novelData.sideCharacters || [],
        totalChapters: novelData.totalChapters,
        currentChapter: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      novels.push(newNovel);
      await fs.writeJson(this.novelsFile, novels, { spaces: 2 });
      
      logger.info(`Novel created: ${newNovel.id} - ${newNovel.title}`);
      return newNovel;
    } catch (error) {
      logger.error('Failed to create novel', { error: error.message });
      throw new Error(`Novel creation failed: ${error.message}`);
    }
  }

  async updateNovelTheme(id, themeData) {
    try {
      const novels = await this.getAllNovels();
      const novelIndex = novels.findIndex(n => n.id === id);
      
      if (novelIndex === -1) {
        throw new Error(`Novel with id ${id} not found`);
      }
      
      novels[novelIndex] = {
        ...novels[novelIndex],
        theme: themeData.theme || novels[novelIndex].theme,
        genre: themeData.genre || novels[novelIndex].genre,
        tone: themeData.tone || novels[novelIndex].tone,
        worldRules: themeData.worldRules || novels[novelIndex].worldRules,
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeJson(this.novelsFile, novels, { spaces: 2 });
      
      logger.info(`Novel theme updated: ${id}`);
      return novels[novelIndex];
    } catch (error) {
      logger.error(`Failed to update novel theme ${id}`, { error: error.message });
      throw error;
    }
  }

  async updateNovelProgress(id, currentChapter) {
    try {
      const novels = await this.getAllNovels();
      const novelIndex = novels.findIndex(n => n.id === id);
      
      if (novelIndex === -1) {
        throw new Error(`Novel with id ${id} not found`);
      }
      
      novels[novelIndex] = {
        ...novels[novelIndex],
        currentChapter,
        status: currentChapter >= novels[novelIndex].totalChapters ? 'completed' : 'active',
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeJson(this.novelsFile, novels, { spaces: 2 });
      
      logger.info(`Novel progress updated: ${id} - Chapter ${currentChapter}`);
      return novels[novelIndex];
    } catch (error) {
      logger.error(`Failed to update novel progress ${id}`, { error: error.message });
      throw error;
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = new NovelService();