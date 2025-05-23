const mongoose = require('mongoose');

  const employeeSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  role: { type: String, default: 'user' }, // Default role
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  Branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
