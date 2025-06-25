const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// 删除评论 (需要认证，并且是评论的所有者)
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router; 