const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Admin adds a user (invitation)
router.post('/add-user', authController.addUserByAdmin);

// User sets password after invitation
router.post('/set-password/:token', authController.setPassword);

// Login route
router.post('/login', authController.login);

// Request password reset
router.post('/password-reset', authController.requestPasswordReset);

// Reset password
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
