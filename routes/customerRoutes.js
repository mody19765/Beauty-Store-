const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Only admins can create, update, or delete customers
router.get('/', customerController.getAllCustomers);
router.post('/', authorizeRole('admin'), customerController.createCustomer);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', authorizeRole('admin'), customerController.updateCustomer);
router.delete('/:id', authorizeRole('admin'), customerController.deleteCustomer);

module.exports = router;
