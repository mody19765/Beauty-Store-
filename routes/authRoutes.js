const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Add user %Admin
router.post('/auth/add-user', authenticateToken, authorizeRole('admin'), authController.addUserByAdmin);

// Set password after invitation
router.post('/auth/set-password/:token', authController.setPassword);
/**
 * http://localhost:3000/login/auth/add-user
 */
// User login route
router.post('/auth/login', authController.login);

// Password reset
router.post('/auth/request-password-reset', authController.requestPasswordReset);
router.post('/auth/reset-password/:token', authController.resetPassword);

module.exports = router;
