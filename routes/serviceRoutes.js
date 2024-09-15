const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const servicesController = require('../controllers/serviceController');

// Apply authentication middleware
router.use(authenticateToken);

// Public route to get services
router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);

// Only admins can create, update, or delete services
router.post('/', authorizeRole('admin'), servicesController.createService);
router.put('/:id', authorizeRole('admin'), servicesController.updateService);
router.delete('/:id', authorizeRole('admin'), servicesController.deleteService);

module.exports = router;
