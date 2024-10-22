const mongoose = require('mongoose');

// Define the session schema
const sessionSchema = new mongoose.Schema({
  phone_number: { type: String },
  Branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  services: [{
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    designer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
    service_start_time: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: 'Service start time must be a future date.'
      }
    },
    service_end_time: { type: Date },
    price: { type: Number}
  }],
  client_name: { type: String, required: true },
  total_price: { type: Number}
}, { timestamps: true });

// Middleware to set end time, calculate total price, and add session_id to services
sessionSchema.pre('save', function (next) {
  this.services.forEach((service) => {
    service.service_end_time = new Date(service.service_start_time.getTime() + 45 * 60000);
    service.session_id = this._id;
  });

  this.total_price = this.services.reduce((acc, service) => acc + service.price, 0);
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
