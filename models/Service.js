const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  duration: { type: Number, default: 45 }, // Duration in minutes
  price: { type: Number, required: true } // Price of the service
}, { timestamps: true });

serviceSchema.index({ name: 1 }); // Index for faster searches by name

module.exports = mongoose.model('Service', serviceSchema);
