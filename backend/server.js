import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// ── Route imports ─────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import touristRoutes from './routes/tourist.js';
import blogRoutes from './routes/blogs.js';
import bookingRoutes from './routes/bookings.js';

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();

// CORS: allow the Vite dev server and any local ports
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'LankaCrafts Tourist API',
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/tourist/auth', authRoutes);          // /register  /login
app.use('/api/tourist', touristRoutes);            // /profile  /stats
app.use('/api/tourist/blogs', blogRoutes);         // CRUD + like
app.use('/api/tourist/bookings', bookingRoutes);   // GET, POST, PATCH cancel

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// express-async-errors automatically passes async errors here
// eslint-disable-next-line no-unused-vars
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

// ── MongoDB connection + server start ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lankacrafts';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connected...`);
    app.listen(PORT, () => {
      console.log(`🚀 LankaCrafts Tourist API running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
