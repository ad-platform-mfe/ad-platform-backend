const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const authMiddleware = require('../middleware/authMiddleware');

// 上报埋点
router.post('/', authMiddleware.optional, trackingController.trackEvent);

// 获取埋点数据 (需要认证)
router.get('/', authMiddleware, trackingController.getTrackingEvents);

module.exports = router;
