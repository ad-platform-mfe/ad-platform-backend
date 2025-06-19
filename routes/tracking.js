const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.optional, trackingController.trackEvent);

module.exports = router;
