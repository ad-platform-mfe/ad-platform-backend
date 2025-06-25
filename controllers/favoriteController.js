const favoriteService = require('../services/favoriteService');

class FavoriteController {
  async addFavorite(req, res) {
    try {
      const userId = req.user.id;
      const materialId = req.params.id;
      const favorite = await favoriteService.addFavorite(userId, materialId);
      if (favorite) {
        res.status(201).json({ code: 0, message: '收藏成功', data: favorite });
      } else {
        res.status(409).json({ code: 1, message: '已经收藏过了' });
      }
    } catch (error) {
      res.status(500).json({ message: '操作失败', error: error.message });
    }
  }

  async removeFavorite(req, res) {
    try {
      const userId = req.user.id;
      const materialId = req.params.id;
      const result = await favoriteService.removeFavorite(userId, materialId);
      if (result > 0) {
        res.status(200).json({ code: 0, message: '取消收藏成功' });
      } else {
        res.status(404).json({ code: 1, message: '还未收藏该素材' });
      }
    } catch (error) {
      res.status(500).json({ message: '操作失败', error: error.message });
    }
  }
}

module.exports = new FavoriteController(); 