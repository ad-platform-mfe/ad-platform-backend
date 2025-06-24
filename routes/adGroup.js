const express = require('express');
const router = express.Router();
const adGroupController = require('../controllers/adGroupController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', adGroupController.createAdGroup);
router.get('/', adGroupController.getAllAdGroups);
router.get('/:id', adGroupController.getAdGroupById);
router.put('/:id', adGroupController.updateAdGroup);
router.delete('/:id', adGroupController.deleteAdGroup);

module.exports = router; 