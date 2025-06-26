const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');

// POST /api/reports - 创建新举报 (普通用户)
router.post('/', authMiddleware, reportController.createReport);

// --- Admin-only routes ---
// GET /api/reports - 获取举报列表 (管理员)
router.get('/', authMiddleware, adminOnly, reportController.listReports);

// PUT /api/reports/:id/resolve - 标记为已解决 (管理员)
router.put('/:id/resolve', authMiddleware, adminOnly, reportController.resolveReport);

// PUT /api/reports/:id/reject-material - 驳回素材并标记为解决 (管理员)
router.put('/:id/reject-material', authMiddleware, adminOnly, reportController.rejectMaterialFromReport);

module.exports = router; 