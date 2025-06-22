const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');

// 所有审核路由都需要认证和管理员权限
router.use(authMiddleware, adminOnly);

// POST /api/reviews/machine/:id - 触发机器审核
router.post('/machine/:id', reviewController.triggerImageReview);

// POST /api/reviews/manual/:id - 提交人工审核结果
router.post('/manual/:id', reviewController.manualReview);

module.exports = router; 