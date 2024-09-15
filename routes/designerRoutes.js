const express = require('express');
const router = express.Router();
const designerController = require('../controllers/designerController');

router.post('/', designerController.createDesigner);
router.get('/', designerController.getAllDesigners);
router.get('/:id', designerController.getDesignerById);
router.put('/:id', designerController.updateDesigner);
router.delete('/:id', designerController.deleteDesigner);
router.get('/search', designerController.searchDesigners);

module.exports = router;