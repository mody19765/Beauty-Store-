const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConfig');
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

// CORS middleware
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Max-Age", "1800");
		res.setHeader("Access-Control-Allow-Headers", "content-type");
		res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Routes
app.use('/', allowCors(require('./routes/authRoutes'))); // Auth routes
app.use('/designers', authMiddleware.authenticateToken, allowCors(require('./routes/designerRoutes')));
app.use('/employees', authMiddleware.authenticateToken, allowCors(require('./routes/employeeRoutes')));
app.use('/sessions', authMiddleware.authenticateToken, allowCors(require('./routes/sessionRoutes')));
app.use('/services', authMiddleware.authenticateToken, allowCors(require('./routes/serviceRoutes')));
app.use('/branches', authMiddleware.authenticateToken, allowCors(require('./routes/branchRoutes')));
app.use('/history', authMiddleware.authenticateToken, allowCors(require('./routes/historyRoutes')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
