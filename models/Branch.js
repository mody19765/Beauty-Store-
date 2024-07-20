const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branch_name: { type: String, required: true },
  address: String,
  phone_number: String,
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);