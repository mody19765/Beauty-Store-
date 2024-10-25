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
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
// CORS Configuration
const corsOptions = {
  origin: 'https://beauty-store-pi.vercel.app', // Match your frontend domain
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Client-Key',
    'X-Client-Token',
    'X-Client-Secret'
  ]
};

// Enable CORS
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://beauty-store-pi.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Client-Key, X-Client-Token, X-Client-Secret");
  return res.sendStatus(200); // Ensure HTTP 200 OK status for preflight
});



// Routes
app.use('/', require('./routes/authRoutes')); // Auth routes
app.use('/designers', authMiddleware.authenticateToken, require('./routes/designerRoutes'));
app.use('/employees', authMiddleware.authenticateToken, require('./routes/employeeRoutes'));
app.use('/sessions', authMiddleware.authenticateToken, require('./routes/sessionRoutes'));
app.use('/services', authMiddleware.authenticateToken, require('./routes/serviceRoutes'));
app.use('/branches', authMiddleware.authenticateToken, require('./routes/branchRoutes'));
app.use('/customers', authMiddleware.authenticateToken, require('./routes/customerRoutes'));
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
