const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const authController = require('../controllers/authController');

// 对发送验证码接口进行频率限制
const codeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  limit: 10, // 每个IP地址在窗口期内最多请求10次
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { msg: '请求过于频繁，请稍后再试' }
});

// 定义路由
// POST /api/auth/code - 发送验证码
router.post('/code', codeLimiter, authController.sendVerificationCode);

// POST /api/auth/login - 使用验证码登录
router.post('/login', authController.loginWithCode);

module.exports = router; 