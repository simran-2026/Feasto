require('dotenv').config({ path: '../.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.route');
const foodPartnerRoutes = require('./routes/food-partner');
const cors = require('cors');

const app = express();
// Allow CORS from configured frontend URL (set FRONTEND_URL in Render/Vercel env)
// const frontendOrigin = process.env.VITE_API_URL || 'http://localhost:5173';
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview URLs and your production URL
    const allowedOrigins = [
      'https://feasto-self.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    // Allow any Vercel preview URL (they contain 'vercel.app')
    if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());




// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Register routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);



module.exports = app;
