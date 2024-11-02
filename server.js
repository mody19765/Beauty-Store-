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

// CORS Setup
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'https://beauty-store-alpha.vercel.app', 'https://beauty-store-pi.vercel.app']// Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options

// Enabling CORS Pre-Flight

app.options('/login',  cors(corsOptions)); // Auth routes
app.options('/designers', cors(corsOptions));
app.options('/users', cors(corsOptions));
app.options('/sessions',cors(corsOptions));
app.options('/services', cors(corsOptions));
app.options('/branches', cors(corsOptions));
app.options('/customers', cors(corsOptions));
app.options('/history', cors(corsOptions));

// Routes
app.use('/login', require('./routes/authRoutes')); // Auth routes
app.use('/designers', authMiddleware.authenticateToken, require('./routes/designerRoutes'));
app.use('/users', authMiddleware.authenticateToken, require('./routes/userRoutes'));
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
