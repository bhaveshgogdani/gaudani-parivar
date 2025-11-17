import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate required environment variables
if (!process.env.MAX_FILE_SIZE) {
  throw new Error('MAX_FILE_SIZE environment variable is required');
}
if (!process.env.UPLOAD_DIR) {
  throw new Error('UPLOAD_DIR environment variable is required');
}
if (!process.env.ALLOWED_FILE_TYPES) {
  throw new Error('ALLOWED_FILE_TYPES environment variable is required');
}

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10);
// Upload directory is now inside backend folder
// From backend/src/config/, go up 2 levels: ../.. -> backend/src, .. -> backend
// Resolve upload directory relative to backend folder
const backendDir = path.resolve(__dirname, '..', '..');
const UPLOAD_DIR = path.resolve(backendDir, process.env.UPLOAD_DIR);

// Create upload directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
  const allowedMimeTypes = allowedTypes.map(type => type.trim());
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

export default upload;

