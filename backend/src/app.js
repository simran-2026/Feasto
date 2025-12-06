require('dotenv').config({ path: '../.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.route');
const foodPartnerRoutes = require('./routes/food-partner');
const cors = require('cors');

// --- BEGIN OPTIMIZED CODE BLOCK ---

const app = express();

// List of allowed origins (Vercel, Render, Local)
const allowedOrigins = [
    'https://feasto-self.vercel.app', // Your deployed Vercel frontend
    'https://feasto-fgcn.onrender.com', // Your deployed Render backend (Self-referencing for safety)
    'http://localhost:5173', // Vite/React default local port
    'http://localhost:3000', // Common Node/Express local port
];

// CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);
        
        // Check if the origin is explicitly allowed or is a Vercel preview/deploy URL
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.error(`CORS Blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // IMPORTANT: Allows cookies (JWT token) to be sent and received
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