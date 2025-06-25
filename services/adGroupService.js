const { AdGroup, Material } = require('../models');
const { Op } = require('sequelize');

class AdGroupService {
  /**
   * 创建广告组并关联素材
   */
  async createAdGroup(data, materialIds = []) {
    const adGroup = await AdGroup.create(data);
    if (materialIds && materialIds.length > 0) {
      const approvedMaterials = await Material.findAll({
        where: {
          id: { [Op.in]: materialIds },
          reviewStatus: 'approved'
        }
      });
      const approvedMaterialIds = approvedMaterials.map((m) => m.id);
      await adGroup.setMaterials(approvedMaterialIds);
    }
    return adGroup;
  }

  /**
   * 获取广告组列表（分页）
   */
  async getAdGroups({ page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    return await AdGroup.findAndCountAll({
      offset,
      limit: parseInt(pageSize, 10),
      order: [['createdAt', 'DESC']],
      include: [{ model: Material, as: 'Materials' }] // 使用别名加载关联的素材
    });
  }

  /**
   * 根据ID获取单个广告组
   */
  async getAdGroupById(id) {
    return await AdGroup.findByPk(id, {
      include: [{ model: Material, as: 'Materials' }] // 使用别名加载关联的素材
    });
  }

  /**
   * 更新广告组并重新关联素材
   */
  async updateAdGroup(id, updateData, materialIds) {
    const adGroup = await AdGroup.findByPk(id);
    if (!adGroup) {
      return null;
    }
    // 更新广告组基本信息
    await adGroup.update(updateData);
    // 如果提供了 materialIds，则更新关联关系
    if (materialIds) {
      if (materialIds.length > 0) {
        const approvedMaterials = await Material.findAll({
          where: {
            id: { [Op.in]: materialIds },
            reviewStatus: 'approved'
          }
        });
        const approvedMaterialIds = approvedMaterials.map((m) => m.id);
        await adGroup.setMaterials(approvedMaterialIds);
      } else {
        await adGroup.setMaterials([]); // 如果传入空数组，则清空所有关联
      }
    }
    return await this.getAdGroupById(id); // 返回更新后的完整数据
  }

  /**
   * 删除广告组
   */
  async deleteAdGroup(id) {
    const adGroup = await AdGroup.findByPk(id);
    if (!adGroup) {
      return 0;
    }
    await adGroup.destroy(); // Sequelize会自动删除中间表中的关联记录
    return 1;
  }
}

module.exports = new AdGroupService(); 