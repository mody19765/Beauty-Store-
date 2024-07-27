const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConfig');
const cors = require("cors")
// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors())
// Routes
app.use('/branches', require('./routes/branchRoutes'));
app.use('/customers', require('./routes/customerRoutes'));
app.use('/customerBookings', require('./routes/customerBookingRoutes'));
app.use('/designers', require('./routes/designerRoutes'));
app.use('/employees', require('./routes/employeeRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));
app.use('/sessions', require('./routes/sessionRoutes'));
app.use('/approvedBookings', require('./routes/approvedBookingRoutes'));
app.use('/services', require('./routes/serviceRoutes'));
app.use('/', (req, res) => {
  res.json({ message: "ساموعووووو" })
})
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});