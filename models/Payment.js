const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customer_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerBooking', required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);