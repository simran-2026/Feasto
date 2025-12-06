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
  origin: [
    'https://feasto-self.vercel.app',
    'http://localhost:5173', // for local development
    'http://localhost:3000'
  ],
  credentials: true, 
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
   allowedHeaders: ['Content-Type', 'Authorization']// Allow cookies to be sent
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
