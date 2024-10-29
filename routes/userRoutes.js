// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
router.use(authenticateToken);

router.put('/:id',authorizeRole('admin'), userController.updateUser);
router.delete('/:id', authorizeRole('admin'),userController.deleteUser);
router.get('/:id', authorizeRole('admin'),userController.findById);
router.get('/search', authorizeRole('admin'),userController.searchUsers);
router.get('/', userController.getAllUsers);

module.exports = router;
