// Shebora Backend Express Application
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import providerRoutes from './src/routes/providerRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';

const app = express();

// Security & Cross-Origin Configuration
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging & Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Shebora Marketplace API',
    city: 'Dhaka, Bangladesh',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 for undefined API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
