const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const commentController = require('../controllers/commentController');
const favoriteController = require('../controllers/favoriteController');
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

// --- 评论相关 ---
// GET /api/materials/:id/comments - 获取评论列表
router.get('/:id/comments', commentController.getCommentsByMaterial);

// POST /api/materials/:id/comments - 发表评论
router.post('/:id/comments', commentController.createComment);

// --- 收藏相关 ---
// POST /api/materials/:id/favorite - 收藏
router.post('/:id/favorite', favoriteController.addFavorite);

// DELETE /api/materials/:id/favorite - 取消收藏
router.delete('/:id/favorite', favoriteController.removeFavorite);

module.exports = router; 