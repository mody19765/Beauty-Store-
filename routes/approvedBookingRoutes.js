const express = require('express');
const router = express.Router();
const approvedBookingController = require('../controllers/approvedBookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware for all routes in this file
router.use(authMiddleware);
router.post('/', approvedBookingController.createApprovedBooking);
router.get('/', approvedBookingController.getAllApprovedBookings);
router.get('/:id', approvedBookingController.getApprovedBookingById);
router.put('/:id', approvedBookingController.updateApprovedBooking);
router.delete('/:id', approvedBookingController.deleteApprovedBooking);

module.exports = router;