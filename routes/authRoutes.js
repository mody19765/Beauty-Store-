const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authAdmin = require('../middlewares/adminauth');
const adminAuth = require('../middlewares/adminauth');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Admin login route
router.post('/auth/admin-login', adminAuth.adminLogin);

router.post('/auth/add-admin', authenticateToken, authorizeRole('admin'), adminAuth.addAdmin);

// Add user by admin
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
