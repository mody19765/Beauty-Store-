const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Apply authentication middleware
router.use(authenticateToken);

// Only admins can create, update, or delete employees
router.get('/', employeeController.getAllEmployees);
router.post('/', authorizeRole('admin'), employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', authorizeRole('admin'), employeeController.updateEmployee);
router.delete('/:id', authorizeRole('admin'), employeeController.deleteEmployee);

module.exports = router;
