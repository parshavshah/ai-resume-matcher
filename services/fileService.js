import fs from 'fs-extra';
import path from 'path';
import { appConfig } from '../config/app.js';

class FileService {
  constructor() {
    this.uploadPath = appConfig.uploadPath;
  }

  // Ensure upload directory exists
  async ensureUploadDirectory() {
    await fs.ensureDir(this.uploadPath);
  }

  // Read file content
  async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Failed to read file');
    }
  }

  // Delete file
  async deleteFile(filePath) {
    try {
      await fs.remove(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error for cleanup operations
    }
  }

  // Get file extension
  getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  // Validate file size
  validateFileSize(fileSize, maxSize = 5 * 1024 * 1024) { // 5MB default
    return fileSize <= maxSize;
  }

  // Get file info
  getFileInfo(file) {
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      extension: this.getFileExtension(file.originalname)
    };
  }
}

export default FileService; 