const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');

const journalRoutes = require('./routes/journalRoutes');
const tagRoutes = require('./routes/tagRoutes');
const moodRoutes = require('./routes/moodRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with specific allowed origins
const allowedOrigins = [
  'https://garima-s-space-pkle.vercel.app',
  'https://garima-s-space-pkle-55szqrwy1-sarangs-projects-8b8ce6ab.vercel.app',
  'http://localhost:3000' // For local development
];

// Enable CORS for specific origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/journal', journalRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mood/trends', require('./routes/moodTrendRoutes'));

// Serve the main index.html for any other GET requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});