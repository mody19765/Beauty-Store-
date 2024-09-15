const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Only admins can create, update, or delete branches
router.get('/', branchController.getAllBranches);
router.post('/', authorizeRole('admin'), branchController.createBranch);
router.get('/:id', branchController.getBranchById);
router.put('/:id', authorizeRole('admin'), branchController.updateBranch);
router.delete('/:id', authorizeRole('admin'), branchController.deleteBranch);

module.exports = router;
