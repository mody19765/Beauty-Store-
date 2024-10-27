const express = require('express');
const router = express.Router();
const designerController = require('../controllers/designerController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Apply authentication middleware

// Only admins can create, update, or delete designers
router.get('/', designerController.getAllDesigners); 
router.post('/', authorizeRole('admin'), designerController.createDesigner);
router.get('/:id', designerController.getDesignerById);
router.put('/:id', authorizeRole('admin'), designerController.updateDesigner);
router.delete('/:id', authorizeRole('admin'), designerController.deleteDesigner);

module.exports = router;
