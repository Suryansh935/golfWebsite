const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. CONFIGURE CORS
// Replace the frontend URL with your actual Vercel URL once deployed
const allowedOrigins = [
  'http://localhost:5173', 
  'https://golf-website-frontend.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 2. MIDDLEWARE (With Stripe Webhook rawBody support)
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf;
    }
  }
}));

// 3. HEALTH CHECK ROUTE (Required for Render/Vercel to show "Live")
app.get('/', (req, res) => {
  res.status(200).json({ message: "Birdie Bounty API is Live", version: "1.0.0" });
});

// 4. API ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/charity', require('./routes/charityRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// 5. DATABASE CONNECTION
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("CRITICAL: MONGODB_URL is missing in .env file");
  process.exit(1);
}

mongoose.connect(MONGODB_URL)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => {
    console.error("MongoDB Connection Error:", err.message);
  });

// 6. SERVER INITIALIZATION
const PORT = process.env.PORT || 5000;

// Only start the server if we aren't in a serverless (Vercel) environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

// 7. VERCEL EXPORT (Required for Serverless Deployment)
module.exports = app;