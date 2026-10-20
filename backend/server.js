// Shebora Backend Server Runner
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Shebora API] Server running on port ${PORT} (Dhaka standard time)`);
});
