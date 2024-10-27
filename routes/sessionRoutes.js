const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const sessionController = require('../controllers/sessionController');

// Apply authentication middleware

// Public route to get sessions
router.get('/',sessionController.getAllSessions);
router.get('/:id', sessionController.getSessionById);

// Only admins can create, update, or delete sessions
router.post('/',sessionController.createSession);
router.put('/:id', authorizeRole('admin'), sessionController.updateSession);
router.delete('/:id', authorizeRole('admin'), sessionController.deleteSession);
// Update service within a session
router.put('/:sessionId/services/:serviceId', 
 authenticateToken,authorizeRole('admin'), 
 sessionController.updateServiceInSession);

// Delete service from a session
router.delete('/:sessionId/services/:serviceId', 
 authenticateToken, authorizeRole('admin'), 
 sessionController.deleteServiceFromSession);


module.exports = router;
