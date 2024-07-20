const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConfig');
// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/branches', require('./routes/branchRoutes'));
app.use('/customers', require('./routes/customerRoutes'));
app.use('/customerBookings', require('./routes/customerBookingRoutes'));
app.use('/designers', require('./routes/designerRoutes'));
app.use('/employees', require('./routes/employeeRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));
app.use('/sessions', require('./routes/sessionRoutes'));
app.use('/approvedBookings', require('./routes/approvedBookingRoutes'));
app.use('/services',require('./routes/serviceRoutes'));
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});