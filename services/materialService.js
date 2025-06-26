const { Material, User, AdGroup } = require('../models');

class MaterialService {
  /**
   * 创建新素材
   */
  async createMaterial(materialData) {
    return await Material.create(materialData);
  }

  /**
   * 获取素材列表（分页）
   */
  async getMaterials({ page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    return await Material.findAndCountAll({
      offset,
      limit: parseInt(pageSize, 10),
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }]
    });
  }

  /**
   * 根据ID获取单个素材
   */
  async getMaterialById(id) {
    return await Material.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: AdGroup,
          through: { attributes: [] } 
        },
        {
          model: User,
          as: 'FavoritingUsers',
          attributes: ['id'], 
          through: { attributes: [] }
        }
      ]
    });
  }

  /**
   * 更新素材
   */
  async updateMaterial(id, updateData) {
    const material = await Material.findByPk(id);
    if (!material) {
      return null;
    }
    return await material.update(updateData);
  }

  /**
   * 删除素材
   */
  async deleteMaterial(id) {
    const material = await Material.findByPk(id);
    if (!material) {
      return 0; // or false
    }
    await material.destroy();
    return 1; // or true
  }
}

module.exports = new MaterialService(); 