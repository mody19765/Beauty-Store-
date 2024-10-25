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

const allowedOrigins = [
  'http://localhost:3000',
  'https://beauty-store-alpha.vercel.app',
  'https://beauty-store-pi.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions)); // Place this before your routes
app.options('*', cors(corsOptions)); // This will handle preflight requests
app.use(function (req, res, next) {
  //Enabling CORS
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");  next();
  });
  app.use(cors()) 

  app.options( 'https://beauty-store-pi.vercel.app' , cors())
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
