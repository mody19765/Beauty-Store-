const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },  ///  token + mail+token   
  phone: { type: String, required: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], required: true },
  isPasswordSet: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);