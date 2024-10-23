// routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const { getHistoryLogs } = require('../controllers/hisControl');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
router.use(authenticateToken);

// Add `authenticateToken` first, then `authorizeRole` to ensure proper access
router.get('/logs',authorizeRole("admin"), getHistoryLogs);

module.exports = router;
