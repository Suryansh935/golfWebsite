const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

/* =========================
   1. CORS CONFIG
========================= */
const allowedOrigins = [
  'https://golf-website-frontend.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));

/* =========================
   2. MIDDLEWARE
========================= */
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf;
    }
  }
}));

/* =========================
   3. DATABASE CONNECTION (FIXED)
========================= */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is missing");
  }

  try {
    console.log("Connecting to MongoDB...");

    const db = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected Successfully");

  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    throw err; // IMPORTANT
  }
};

/* =========================
   4. GLOBAL DB MIDDLEWARE (KEY FIX)
========================= */
app.use(async (req, res, next) => {
  try {
    await connectDB(); // ensures DB is connected for every request
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Database connection failed",
      error: err.message
    });
  }
});

/* =========================
   5. HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Birdie Bounty API is Live",
    version: "1.0.0"
  });
});

/* =========================
   6. ROUTES
========================= */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/charity', require('./routes/charityRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

/* =========================
   7. LOCAL SERVER (DEV ONLY)
========================= */
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

/* =========================
   8. EXPORT FOR VERCEL
========================= */
module.exports = app;