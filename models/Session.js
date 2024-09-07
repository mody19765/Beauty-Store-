const mongoose = require('mongoose');

// Define the session schema
const sessionSchema = new mongoose.Schema({
  Branch_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true 
  },
  services: [{
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    designer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
    service_start_time: { 
      type: Date, 
      required: true, 
      validate: {
        validator: function (value) {
          return value >= new Date(); // Ensure service start time is not in the past
        },
        message: 'Service start time must be a future date.'
      }
    },
    service_end_time: { 
      type: Date,
    },
    price: { type: Number, required: true }
  }],
  client_name: { type: mongoose.Schema.Types.String, ref: 'Customer', required: true },
  total_price: { type: Number, required: true }
}, { timestamps: true });

// Middleware to automatically set end time and calculate total price
sessionSchema.pre('validate', function (next) {
  this.services.forEach(service => {
    // Calculate the service end time
    service.service_end_time = new Date(service.service_start_time.getTime() + 45 * 60000); // Add 45 minutes
  });

  // Calculate total price
  this.total_price = this.services.reduce((acc, service) => acc + service.price, 0);

  next();
});

module.exports = mongoose.model('Session', sessionSchema);
                  
