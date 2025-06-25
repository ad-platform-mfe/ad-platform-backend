const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/dashboard/kpi - 获取核心KPI指标
router.get('/kpi', authMiddleware, dashboardController.getKpiStats);

// GET /api/dashboard/trend - 获取趋势图数据
router.get('/trend', authMiddleware, dashboardController.getTrendStats);

module.exports = router; 