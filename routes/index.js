const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const contentController = require('../controllers/contentController');
const playLogController = require('../controllers/playLogController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由 - 用户注册和登录
router.post('/register', userController.register);
router.post('/login', userController.login);

// --- 以下所有路由都需要认证 ---
router.use(authMiddleware);

// 用户相关路由
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// 广告内容相关路由
router.get('/content', contentController.getAllContents);
router.post('/content', contentController.createContent);
router.put('/content/:id', contentController.updateContent);
router.delete('/content/:id', contentController.deleteContent);

// 播放日志相关路由
router.get('/play_log', playLogController.getAllPlayLogs);
router.post('/play_log', playLogController.createPlayLog);
router.delete('/play_log/:id', playLogController.deletePlayLog);

module.exports = router; 