import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

if (!process.env.PORT) {
  throw new Error('PORT environment variable is required');
}
if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV environment variable is required');
}

const PORT = process.env.PORT;

// Get current directory (ES modules compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to SSL certificate and key files (ssl folder is outside backend folder)
const certPath = path.join(__dirname, '..', 'ssl', 'tiktakti.net.cert');
const keyPath = path.join(__dirname, '..', 'ssl', 'tiktakti.net.key');

/**
 * Start the server with HTTPS if SSL certificates are found, otherwise use HTTP
 */
function startServer() {
  // Check if certificate and key files exist
  const hasCert = fs.existsSync(certPath);
  const hasKey = fs.existsSync(keyPath);

  if (hasCert && hasKey) {
    try {
      // Read SSL certificate and private key
      const certificate = fs.readFileSync(certPath, 'utf8');
      const privateKey = fs.readFileSync(keyPath, 'utf8');

      // Create HTTPS server
      const httpsServer = https.createServer(
        {
          cert: certificate,
          key: privateKey,
        },
        app
      );

      // Start HTTPS server on the same port
      httpsServer.listen(PORT, () => {
        console.log(`✅ HTTPS Server is running on port ${PORT}`);
        console.log(`🔒 Secure connection available at: https://localhost:${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      });
    } catch (error) {
      console.error('❌ Error starting HTTPS server:', error.message);
      console.log('🔄 Falling back to HTTP...');

      // Fallback to HTTP on the same port
      http.createServer(app).listen(PORT, () => {
        console.log(`✅ HTTP Server is running on port ${PORT}`);
        console.log(`🌐 Server available at: http://localhost:${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      });
    }
  } else {
    console.log('📝 SSL certificate or private key not found');
    console.log(`🔍 Looking for: ${certPath} and ${keyPath}`);
    console.log('🔄 Starting HTTP server...');

    // Start HTTP server only
    http.createServer(app).listen(PORT, () => {
      console.log(`✅ HTTP Server is running on port ${PORT}`);
      console.log(`🌐 Server available at: http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  }
}

// Connect to database and start server
connectDatabase()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

