const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const favouriteRoutes = require('./routes/favourites');
const errorHandler = require('./middleware/errorHandler');

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

// Routes 
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Error Handler
app.use(errorHandler); 

app.use((err, req, res, next) => {
  console.error(' Server Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// Start Server 
const PORT = process.env.PORT || 5001; // make sure this matches your curl/client
app.listen(PORT, () => {
  console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});