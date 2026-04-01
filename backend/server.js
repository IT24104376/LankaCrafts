import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Fix __dirname for ES modules ─────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Route imports ────────────────────────────────────────────
// Tourist module
//import authRoutes from './routes/auth.js';
import authRoutes from './src/routes/authRoutes.js';
import touristRoutes from './routes/tourist.js';
import blogRoutes from './routes/blogs.js';
import bookingRoutes from './routes/bookings.js';

// Review / AI / Artist module
import reviewRoutes from './src/routes/reviewRoutes.js';
import authRoutesV2 from './src/routes/authRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import artistRoutes from './src/routes/artistRoutes.js';

// ── App setup ────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/lankacrafts';

// ── Middleware ───────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      process.env.CLIENT_ORIGIN
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'LankaCrafts API',
    timestamp: new Date().toISOString()
  });
});

// ── API routes ───────────────────────────────────────────────

// Tourist APIs
app.use('/api/tourist/auth', authRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/tourist/blogs', blogRoutes);
app.use('/api/tourist/bookings', bookingRoutes);

// Review / AI / Artist APIs
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutesV2);
app.use('/api/ai', aiRoutes);
app.use('/api/artists', artistRoutes);

// ── 404 handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `${field} already exists.` });
  }

  if (err.message === 'Unsupported file type.') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File exceeds 30MB limit.' });
  }

  res.status(500).json({ error: 'Internal server error.' });
});

// ── MongoDB connection + server start ────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });