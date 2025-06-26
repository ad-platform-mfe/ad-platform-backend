const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');

// 所有财务相关路由都需要认证
router.use(authMiddleware);

// GET /api/finance/transactions - 获取交易明细列表
router.get('/transactions', financeController.listTransactions);

module.exports = router; 