const express = require('express');
const router = express.Router();
const customerBookingController = require('../controllers/customerBookingController');

router.post('/', customerBookingController.createCustomerBooking);
router.get('/', customerBookingController.getAllCustomerBookings);
router.get('/:id', customerBookingController.getCustomerBookingById);
router.put('/:id', customerBookingController.updateCustomerBooking);
router.delete('/:id', customerBookingController.deleteCustomerBooking);

module.exports = router;