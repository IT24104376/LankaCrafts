import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// ── Route imports ─────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import touristRoutes from './routes/tourist.js';
import blogRoutes from './routes/blogs.js';
import workshopBookingRoutes from './routes/bookingRoutes.js';

import artistAuthRoutes from './routes/artistAuth.js';
import artistProfileRoutes from './routes/artistProfile.js';
import artistRoutes from './routes/artists.js';
import craftRoutes from './routes/crafts.js';
import paymentRoutes from './routes/payments.js';

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();

// ✅ UNIFIED CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from localhost, GitHub Codespaces, and no origin (mobile/desktop apps)
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('.app.github.dev') ||
      origin.includes('github.dev')
    ) {
      callback(null, true);
    } else {
      console.log(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browsers
};

// Apply CORS middleware BEFORE all routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Add explicit preflight handler (optional, but good for debugging)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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
app.use('/api/tourist/auth', authRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/tourist/blogs', blogRoutes);
app.use('/api/bookings', workshopBookingRoutes);

app.use('/api/artist/auth', artistAuthRoutes);
app.use('/api/artist', artistProfileRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/crafts', craftRoutes);
app.use('/api/payments', paymentRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
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
    console.log(`MongoDB connected...`);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`LankaCrafts Tourist API running on http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });