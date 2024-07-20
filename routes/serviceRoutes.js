const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/serviceController');

// Create a new service
router.post('/', servicesController.createService);

// Get all services
router.get('/', servicesController.getAllServices);

// Get service by ID
router.get('/:id', servicesController.getServiceById);

// Update service by ID
router.put('/:id', servicesController.updateService);

// Delete service by ID
router.delete('/:id', servicesController.deleteService);

module.exports = router;
