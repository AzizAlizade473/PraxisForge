import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // PraxisForge main API
      '/PraxisForge_Backend': {
        target: 'http://16.170.179.235',
        changeOrigin: true,
      },
      // Auth API
      '/backend_forge': {
        target: 'http://16.170.179.235',
        changeOrigin: true,
      },
    },
  },
});