import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import artistRoutes from './routes/artists.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import chatRoutes from './routes/chat.js';
import orderRoutes from './routes/orders.js';
import mapRoutes from './routes/map.js';
import productRoutes from './routes/products.js';
import { errorHandler } from './middleware/errorHandler.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const JWT_SECRET = process.env.JWT_SECRET || 'lankacraft-local-jwt-secret-2026-demo';

const app = express();
const server = http.createServer(app);

app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 600,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    process.env.NODE_ENV === 'test' ||
    (process.env.NODE_ENV !== 'production' &&
      req.method === 'GET' &&
      req.originalUrl.startsWith('/api/chat')),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/orders/webhook', express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'LankaCrafts API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      artists: '/api/artists',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      map: '/api/map',
      chat: '/api/chat',
    },
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const onlineUsers = new Set();
app.set('io', io);
app.set('onlineUsers', onlineUsers);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.uid);
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.data.user = {
      id: user._id.toString(),
      role: user.role,
      fullName: user.fullName,
    };

    return next();
  } catch (error) {
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.user.id;
  onlineUsers.add(userId);
  socket.join(`user:${userId}`);

  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
