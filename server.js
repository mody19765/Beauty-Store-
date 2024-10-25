const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConfig');
const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');
const dotnev = require('dotenv')

dotnev.config()

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;+

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

// CORS Setup
// CORS Setup
const allowedOrigins = ['http://localhost:3000', 'https://beauty-store-alpha.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no `origin` (like mobile apps or Postman) or from `allowedOrigins`
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is included for preflight
  credentials: true, // Enable credentials like cookies
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'], // Extend allowed headers
  preflightContinue: true, // Optionally allow preflight requests to pass through to middleware
  optionsSuccessStatus: 200 // Provide a successful status for OPTIONS preflight
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', cors(corsOptions));




// Routes
app.use('/', require('./routes/authRoutes')); // Auth routes
app.use('/designers', authMiddleware.authenticateToken, require('./routes/designerRoutes'));
app.use('/employees', authMiddleware.authenticateToken, require('./routes/employeeRoutes'));
app.use('/sessions', authMiddleware.authenticateToken, require('./routes/sessionRoutes'));
app.use('/services', authMiddleware.authenticateToken, require('./routes/serviceRoutes'));
app.use('/branches', authMiddleware.authenticateToken, require('./routes/branchRoutes'));
app.use('/history', authMiddleware.authenticateToken, require('./routes/historyRoutes'));


// Default route
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
