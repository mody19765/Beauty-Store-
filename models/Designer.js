const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  phone_number: { type: String, required: true, unique: true }, // Ensure phone number is unique
  specialization: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }]
}, { timestamps: true });

designerSchema.index({ name: 1, branch_id: 1 }); // Index for searches by name and branch

module.exports = mongoose.model('Designer', designerSchema);
