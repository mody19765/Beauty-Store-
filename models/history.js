const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
 action: String,
 timestamp: { type: Date, index: true }, // Ensure index is added
 details: String,
});


module.exports = mongoose.model('History', historySchema);
