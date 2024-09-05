const mongoose = require('mongoose');

// Define the session schema
const sessionSchema = new mongoose.Schema({
  session_date: { type: Date, required: true },
  Branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  designer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  client_name: { type: mongoose.Schema.Types.String, ref: 'Customer', required: true },
  total_price: { type: Number, required: true }
}, { timestamps: true });

// Middleware to automatically set end time and calculate total price
sessionSchema.pre('validate', function (next) {
  // Check if each service's start time is after or equal to the session date
  for (const service of this.services) {
    if (service.service_start_time < this.session_date) {
      return next(new Error('Service start time must not be before the session start time.'));
    }
    // Calculate the service end time
    service.service_end_time = new Date(service.service_start_time.getTime() + 45 * 60000); // Add 45 minutes
  }
  
  // Calculate total price
  this.total_price = this.services.reduce((acc, service) => acc + service.price, 0);

  next();
});

module.exports = mongoose.model('Session', sessionSchema);
