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
const corsOptions = {
  origin: function (origin, callback) {
    // Allow local development origins
    const allowedOrigins = ['http://localhost:3000', 'https://beauty-store-alpha.vercel.app'];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));

// Preflight request handling for all routes
app.options('*', cors(corsOptions));



// Routes
app.use('/login', require('./routes/authRoutes')); // Auth routes
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


const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = '123'; // Replace with your password

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
