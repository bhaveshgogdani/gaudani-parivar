import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(filePath);
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const fileExists = (filePath) => {
  return fs.existsSync(path.resolve(filePath));
};

export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

export const sanitizeFileName = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

