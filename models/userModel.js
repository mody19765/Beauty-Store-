const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'media'], required: true },
  password: { type: String },
  isPasswordSet: { type: Boolean, default: false }, // Track if the user has set a password
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
