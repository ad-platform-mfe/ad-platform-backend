const adGroupService = require('../services/adGroupService');

class AdGroupController {
  // 创建广告组
  async createAdGroup(req, res) {
    try {
      const { name, mainCategory, tags, materialIds } = req.body;
      const user_id = req.user.id;
      if (!name || !mainCategory) {
        return res.status(400).json({ message: '名称和主分类不能为空' });
      }
      const adGroupData = { name, mainCategory, tags, user_id };
      const adGroup = await adGroupService.createAdGroup(adGroupData, materialIds);
      res.status(201).json({ code: 0, msg: '创建成功', data: adGroup });
    } catch (error) {
      res.status(500).json({ message: '创建广告组失败', error: error.message });
    }
  }

  // 获取广告组列表
  async getAllAdGroups(req, res) {
    try {
      const { page, pageSize } = req.query;
      const { count, rows } = await adGroupService.getAdGroups({ page, pageSize });
      res.json({ code: 0, msg: '获取成功', data: { total: count, list: rows, page, pageSize } });
    } catch (error) {
      res.status(500).json({ message: '获取广告组列表失败', error: error.message });
    }
  }

  // 获取单个广告组
  async getAdGroupById(req, res) {
    try {
      const adGroup = await adGroupService.getAdGroupById(req.params.id);
      if (!adGroup) {
        return res.status(404).json({ message: '广告组不存在' });
      }
      res.json({ code: 0, msg: '获取成功', data: adGroup });
    } catch (error) {
      res.status(500).json({ message: '获取广告组失败', error: error.message });
    }
  }

  // 更新广告组
  async updateAdGroup(req, res) {
    try {
      const { name, mainCategory, tags, materialIds } = req.body;
      const updateData = { name, mainCategory, tags };
      const adGroup = await adGroupService.updateAdGroup(req.params.id, updateData, materialIds);
      if (!adGroup) {
        return res.status(404).json({ message: '广告组不存在' });
      }
      res.json({ code: 0, msg: '更新成功', data: adGroup });
    } catch (error) {
      res.status(500).json({ message: '更新广告组失败', error: error.message });
    }
  }

  // 删除广告组
  async deleteAdGroup(req, res) {
    try {
      const result = await adGroupService.deleteAdGroup(req.params.id);
      if (!result) {
        return res.status(404).json({ message: '广告组不存在' });
      }
      res.status(200).json({ code: 0, msg: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '删除广告组失败', error: error.message });
    }
  }
}

module.exports = new AdGroupController(); 