import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Security middleware - configure to allow cross-origin resources for images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false, // Allow embedding images
  })
);

// CORS configuration
const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files with CORS headers
// Upload directory is now inside backend folder
// From backend/src/, go up 1 level: .. -> backend
// Serve from backend/uploads/ (parent directory) so /uploads/results/... URLs work correctly
const backendDir = path.resolve(__dirname, '..');
const uploadsBaseDir = path.resolve(backendDir, 'uploads');

// Middleware to add CORS headers for uploaded files (images)
app.use('/uploads', (req, res, next) => {
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return res.sendStatus(200);
  }
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // Set Cross-Origin-Resource-Policy to allow cross-origin requests
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  // Set Content-Type for images (will be overridden by express.static if needed)
  if (req.path.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/i)) {
    const ext = req.path.split('.').pop().toLowerCase();
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
    };
    res.header('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  }
  next();
});

app.use('/uploads', express.static(uploadsBaseDir));

// API routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

