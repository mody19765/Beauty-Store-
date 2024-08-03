const mongoose = require('mongoose');

  const employeeSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  role:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  branch_name:{ type: mongoose.Schema.Types.String, ref: 'Branch', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
