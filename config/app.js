import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const appConfig = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  openaiApiKey: process.env.OPENAI_API_KEY,
  uploadPath: path.join(__dirname, '..', 'uploads'),
  viewsPath: path.join(__dirname, '..', 'views'),
  publicPath: path.join(__dirname, '..', 'public'),
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default appConfig; 