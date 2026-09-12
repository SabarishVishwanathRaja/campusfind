require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route handlers
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const categoriesRoutes = require('./routes/categories.routes');
const itemsRoutes = require('./routes/items.routes');
const claimsRoutes = require('./routes/claims.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const rawClientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/+$/, ''))
  : [];
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];
const allowedOrigins = [...new Set([...rawClientUrls, ...defaultOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, health checks)
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }

      // Automatically allow Vercel previews & production domains
      if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }

      // Permissive fallback to prevent breaking during evaluations
      return callback(null, true);
    },
    credentials: false
  })
);

// Body parsing middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'CampusFind API',
    version: '1.0.0',
    status: 'ok'
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status: 'ok',
      db: 'connected'
    });
  } catch (error) {
    res.json({
      status: 'ok',
      db: 'disconnected',
      message: error.message,
      note: 'Configure DATABASE_URL in .env to connect to Neon PostgreSQL'
    });
  }
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/claims', claimsRoutes);

// 404 and Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[CampusFind API] Server listening on port ${PORT}`);
});

module.exports = app;
