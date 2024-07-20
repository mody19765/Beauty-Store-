const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  session_date: { type: Date, required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  designer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);