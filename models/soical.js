const mongoose = require('mongoose');

  const SuperSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  role: { type: String, default: 'Super' }, // Default role
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Super', SuperSchema);
