const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  Phone: Number,
  email: { type: String, required: true, unique: true },
  specialization: String
},
  { timestamps: true });

module.exports = mongoose.model('Designer', designerSchema);