const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConfig');
const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');
const dotenv = require('dotenv');

dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://beauty-store-pi.vercel.app', // Update to match your front-end
  credentials: true, // This must be true to allow credentials
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

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));
// Handle preflight requests specifically for the login route
app.options('/login', cors(corsOptions));

// Routes
app.use('/', require('./routes/authRoutes')); // Auth routes
app.use('/designers', authMiddleware.authenticateToken, require('./routes/designerRoutes'));
app.use('/employees', authMiddleware.authenticateToken, require('./routes/employeeRoutes'));
app.use('/sessions', authMiddleware.authenticateToken, require('./routes/sessionRoutes'));
app.use('/services', authMiddleware.authenticateToken, require('./routes/serviceRoutes'));
app.use('/branches', authMiddleware.authenticateToken, require('./routes/branchRoutes'));
app.use('/history', authMiddleware.authenticateToken, require('./routes/historyRoutes'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
