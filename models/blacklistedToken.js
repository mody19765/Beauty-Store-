// models/blacklistedToken.js
const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  blacklistedAt: { type: Date, default: Date.now, expires: '1d' } // Automatically remove after 1 day
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
