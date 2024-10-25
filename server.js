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

const allowedOrigins = ['http://localhost:3000', 'https://beauty-store-alpha.vercel.app', 'https://beauty-store-pi.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from allowedOrigins or no origin (like mobile apps or Postman)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include all necessary methods
  credentials: true, // Allow cookies/auth headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'], // Ensure all required headers are included
  optionsSuccessStatus: 204 // Successful status for preflight requests
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// Handle Preflight Requests
app.options('*', cors(corsOptions));

// Middleware to Set Headers Explicitly
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); // Set the origin dynamically
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies/auth headers
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // Correct method formatting
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token, Content-Length, Content-MD5, Date, X-Api-Version'
    );
  }
  next();
});





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
