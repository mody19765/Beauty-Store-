const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  phone_number: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  specialization: String
},
  { timestamps: true });

module.exports = mongoose.model('Designer', designerSchema);