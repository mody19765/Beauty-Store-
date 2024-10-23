const History = require('../models/history');

const logHistory = async ({ userId, action, timestamp, details }) => {
  try {
    const historyEntry = new History({
      userId,
      action,
      timestamp,
      details
    });
    await historyEntry.save();
    console.log("History log saved:", historyEntry); // Add this for debugging
  } catch (error) {
    console.error("Error logging history:", error);
  }
};

module.exports = logHistory;
