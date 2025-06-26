const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// 所有消息相关路由都需要认证
router.use(authMiddleware);

// GET /api/messages - 获取当前用户的消息列表
router.get('/', messageController.listMessages);

// PUT /api/messages/mark-all-read - 将所有消息标记为已读
router.put('/mark-all-read', messageController.markAllAsRead);

// PUT /api/messages/:id/read - 将单条消息标记为已读
router.put('/:id/read', messageController.markAsRead);


module.exports = router; 