const express = require('express');
const router = express.Router();
const adGroupController = require('../controllers/adGroupController');

// POST /api/adGroup/create - 创建广告组
router.post('/create', adGroupController.create);

// GET /api/adGroup/list - 获取广告组列表
router.get('/list', adGroupController.list);

// GET /api/adGroup/detail/:id - 获取单个广告组详情
router.get('/detail/:id', adGroupController.getById);

// PUT /api/adGroup/update/:id - 更新广告组
router.put('/update/:id', adGroupController.update);

// DELETE /api/adGroup/delete/:id - 删除广告组
router.delete('/delete/:id', adGroupController.delete);

module.exports = router; 