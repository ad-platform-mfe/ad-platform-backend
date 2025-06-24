const adGroupService = require('../services/adGroupService');

class AdGroupController {
  // 创建广告组
  async create(req, res) {
    try {
      const { name, mainCategory, tags, materialIds } = req.body;
      const adGroupData = {
        name,
        mainCategory,
        tags,
        user_id: req.user.id
      };
      const adGroup = await adGroupService.createAdGroup(adGroupData, materialIds);
      res.status(201).json({ code: 0, msg: '创建成功', data: adGroup });
    } catch (error) {
      res.status(500).json({ message: '创建广告组失败', error: error.message });
    }
  }

  // 获取广告组列表
  async list(req, res) {
    try {
      const { page, pageSize } = req.query;
      const data = await adGroupService.getAdGroups({ page, pageSize });
      res.status(200).json({ code: 0, msg: '获取成功', data });
    } catch (error) {
      res.status(500).json({ message: '获取广告组列表失败', error: error.message });
    }
  }

  // 获取单个广告组
  async getById(req, res) {
    try {
      const { id } = req.params;
      const adGroup = await adGroupService.getAdGroupById(id);
      if (!adGroup) {
        return res.status(404).json({ message: '广告组未找到' });
      }
      res.status(200).json({ code: 0, msg: '获取成功', data: adGroup });
    } catch (error) {
      res.status(500).json({ message: '获取广告组失败', error: error.message });
    }
  }

  // 更新广告组
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, mainCategory, tags, materialIds } = req.body;
      const updateData = { name, mainCategory, tags };
      const updatedAdGroup = await adGroupService.updateAdGroup(id, updateData, materialIds);
      if (!updatedAdGroup) {
        return res.status(404).json({ message: '广告组未找到' });
      }
      res.status(200).json({ code: 0, msg: '更新成功', data: updatedAdGroup });
    } catch (error) {
      res.status(500).json({ message: '更新广告组失败', error: error.message });
    }
  }

  // 删除广告组
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await adGroupService.deleteAdGroup(id);
      if (result === 0) {
        return res.status(404).json({ message: '广告组未找到' });
      }
      res.status(200).json({ code: 0, msg: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '删除广告组失败', error: error.message });
    }
  }
}

module.exports = new AdGroupController(); 