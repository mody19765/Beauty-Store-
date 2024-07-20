const mongoose = require('mongoose');

const approvedBookingSchema = new mongoose.Schema({
  customer_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerBooking', required: true },
  approval_status: { type: String, enum: ['Approved', 'Rejected'], required: true },
  approval_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ApprovedBooking', approvedBookingSchema);