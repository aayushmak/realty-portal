const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const favouriteRoutes = require('./routes/favourites');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware 
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger 
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes (keep these before frontend catch-all)
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favourites', favouriteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Realty Portal API is running 🏠' });
});
app.get('/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
});

// Serve frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// React catch-all route (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
});

// Error Handler
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(' Server Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});