import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import backendApp from './backend/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'shebora-backend-api',
        configureServer(server) {
          server.middlewares.use(backendApp);
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './frontend/src'),
        '@backend': path.resolve(__dirname, './backend/src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
