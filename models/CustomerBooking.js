const mongoose = require('mongoose');

const customerBookingSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  booking_date: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('CustomerBooking', customerBookingSchema);