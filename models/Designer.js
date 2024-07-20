const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  experience: Number,
  specialization: String
}, { timestamps: true });

module.exports = mongoose.model('Designer', designerSchema);