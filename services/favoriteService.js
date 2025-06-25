const { Favorite } = require('../models');

class FavoriteService {
  async addFavorite(userId, materialId) {
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, materialId }
    });
    return created ? favorite : null;
  }

  async removeFavorite(userId, materialId) {
    const result = await Favorite.destroy({
      where: { userId, materialId }
    });
    return result;
  }
}

module.exports = new FavoriteService(); 