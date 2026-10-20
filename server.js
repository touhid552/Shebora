// Shebora Full-Stack Single Entry Server
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import backendApp from './backend/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.APP_PORT || 3000;

async function startServer() {
  const app = express();

  // Mount backend API routes
  app.use(backendApp);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Shebora Full-Stack] Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Shebora] Server startup failure:', err);
  process.exit(1);
});
