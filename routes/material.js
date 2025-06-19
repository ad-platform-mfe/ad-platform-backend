const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/materials - 创建新素材
router.post('/', materialController.createMaterial);

// GET /api/materials - 获取素材列表（分页）
router.get('/', materialController.getAllMaterials);

// GET /api/materials/:id - 获取单个素材
router.get('/:id', materialController.getMaterialById);

// PUT /api/materials/:id - 更新素材
router.put('/:id', materialController.updateMaterial);

// DELETE /api/materials/:id - 删除素材
router.delete('/:id', materialController.deleteMaterial);

module.exports = router; 