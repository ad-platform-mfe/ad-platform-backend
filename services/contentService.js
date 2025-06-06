const { Content } = require('../models');

class ContentService {
  // 获取所有广告内容
  async getAllContents() {
    return await Content.findAll();
  }

  // 根据ID获取广告内容
  async getContentById(id) {
    return await Content.findByPk(id);
  }

  // 创建广告内容
  async createContent(contentData) {
    return await Content.create(contentData);
  }

  // 更新广告内容
  async updateContent(id, contentData) {
    const [updatedRowsCount] = await Content.update(contentData, {
      where: { id }
    });
    return updatedRowsCount > 0;
  }

  // 删除广告内容
  async deleteContent(id) {
    const deletedRowsCount = await Content.destroy({
      where: { id }
    });
    return deletedRowsCount > 0;
  }

  // 检查标题是否存在
  async isTitleExists(title) {
    const content = await Content.findOne({
      where: { title }
    });
    return !!content;
  }
}

module.exports = new ContentService(); 