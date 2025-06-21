const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/reviews/trigger/:id - 触发单个素材的AI审核
router.post('/trigger/:id', authMiddleware, reviewController.triggerImageReview);

module.exports = router; 