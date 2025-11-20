import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Base path for assets - production needs /bhavesh/
  // Dev server will serve at http://localhost:5175/bhavesh/
  // Router basename in App.tsx will adjust based on hostname detection
  base: '/bhavesh/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
    },
  },
});

