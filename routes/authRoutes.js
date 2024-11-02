const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { logout } = require('../controllers/authController');

// Add user %Admin
router.post('/add-user', authenticateToken, authorizeRole('admin'), authController.addUserByAdmin);

// Set password after invitation
router.post('/set-password/:token', authController.setPassword); // login/set-password/:token { password:123}
/**
 * http://localhost:3000/login/auth/add-user
 */
// User login route
router.post('/', authController.login);
router.post('/logout', authenticateToken, logout);

// Password reset
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;


// login
// /login//add-user { data } 