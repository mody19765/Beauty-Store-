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


// CORS Middleware with multiple allowed origins


const corsOptions = {
  origin: ['http://localhost:3000', 'https://beauty-store-alpha.vercel.app'], // Allow frontend origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies/auth headers
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers if needed
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight requests handling




// Routes
app.use('/login', require('./routes/authRoutes')); // Auth routes
app.use('/designers', authMiddleware.authenticateToken, require('./routes/designerRoutes'));
app.use('/employees', authMiddleware.authenticateToken, require('./routes/employeeRoutes'));
app.use('/sessions', authMiddleware.authenticateToken, require('./routes/sessionRoutes'));
app.use('/services', authMiddleware.authenticateToken, require('./routes/serviceRoutes'));
app.use('/branches', authMiddleware.authenticateToken, require('./routes/branchRoutes'));
app.use('/customers', authMiddleware.authenticateToken, require('./routes/customerRoutes'));

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

/**
 * const handleLogin = async () => {
  console.log('Attempting to login...');
  setError(''); 
  try {
    const response = await axios.post('http://beauty-store-alpha.vercel.app/login/auth/admin-login', {
      email: email, 
      password: password 
    }, {
      withCredentials: true 
    });

    if (response.data.token) {
      console.log('Token:', response.data.token);
      localStorage.setItem('token', response.data.token); 
      navigate('/'); // Redirect to home page
    } else {
      setError('Login failed, please check your credentials.'); 
    }
  } catch (error) {
    console.error('Error logging in:', error);
    setError('Login failed, please try again.'); 
  }
};

 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */