import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { appConfig } from './config/app.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import FileService from './services/fileService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize services
const fileService = new FileService();

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', appConfig.viewsPath);

// Middleware
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(appConfig.publicPath));

// Ensure upload directory exists
await fileService.ensureUploadDirectory();

// Routes
app.use('/', assessmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('index', { 
    result: null, 
    error: 'Page not found' 
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(appConfig.port, appConfig.host, () => {
  console.log(`HR Assessment App running on http://${appConfig.host}:${appConfig.port}`);
  console.log(`Environment: ${appConfig.nodeEnv}`);
});

export default app; 