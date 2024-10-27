const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  service_name: { type: String, required: true },
  service_description: String,
  service_duration: { type: Number, default: 45 }, // Duration in minutes
  service_price: { type: Number, required: true } // Price of the service
}, { timestamps: true });

serviceSchema.index({ name: 1 }); // Index for faster searches by name

module.exports = mongoose.model('Service', serviceSchema);
