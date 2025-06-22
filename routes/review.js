const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// 所有审核路由都需要认证
router.use(authMiddleware);

// POST /api/reviews/machine/:id - 触发机器审核
router.post('/machine/:id', reviewController.triggerImageReview);

// POST /api/reviews/manual/:id - 提交人工审核结果
router.post('/manual/:id', reviewController.manualReview);

module.exports = router; 