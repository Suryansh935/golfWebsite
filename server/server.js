const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ====================== CORS CONFIGURATION ======================
const allowedOrigins = [
  'https://golf-website-frontend.vercel.app',   // Your frontend on Vercel
  'http://localhost:5173',                      // Local frontend
  'https://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight OPTIONS requests globally
app.options('*', cors());

// ====================== MIDDLEWARE ======================
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf;
    }
  }
}));

// ====================== HEALTH CHECK ======================
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "Birdie Bounty API is Live ✅", 
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development'
  });
});

// ====================== API ROUTES ======================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/charity', require('./routes/charityRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// ====================== DATABASE ======================
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("❌ CRITICAL: MONGODB_URL is missing in Environment Variables");
  // Don't exit in serverless — just log
} else {
  mongoose.connect(MONGODB_URL)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err.message));
}

// ====================== VERCEL SERVERLESS EXPORT ======================
module.exports = app;

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}