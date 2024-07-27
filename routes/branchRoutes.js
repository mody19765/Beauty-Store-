const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { searchEmployees } = require('../controllers/employeeController');

router.post('/', branchController.createBranch);
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);
router.get('/search', searchEmployees);

module.exports = router;