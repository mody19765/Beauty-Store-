// controllers/historyController.js
const History = require('../models/history');
exports.getHistoryLogs = async (req, res) => {
 try {
   const { page = 1, limit = 10 } = req.query; // Default to 10 logs per page
   const skip = (page - 1) * limit;
   const logs = await History.find()
     .sort({ timestamp: -1 }) // Sort by most recent
     .skip(skip)
     .limit(Number(limit))
     .lean(); // Use .lean() for faster read-only queries

   const total = await History.countDocuments();

   res.status(200).json({
     total,
     page: Number(page),
     limit: Number(limit),
     logs,
   });
 } catch (error) {
   res.status(500).json({ message: 'Error fetching logs', error: error.message });
 }
};

