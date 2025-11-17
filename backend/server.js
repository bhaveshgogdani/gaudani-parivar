import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
  throw new Error('PORT environment variable is required');
}
if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV environment variable is required');
}

const PORT = process.env.PORT;

// Connect to database
connectDatabase()
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

