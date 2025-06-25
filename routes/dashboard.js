const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/dashboard/kpi - 获取核心KPI指标
router.get('/kpi', authMiddleware, dashboardController.getKpiStats);

module.exports = router; 