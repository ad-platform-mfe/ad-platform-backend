const materialService = require('../services/materialService');

class MaterialController {
  // 创建素材
  async createMaterial(req, res) {
    try {
      const { title, data } = req.body;
      const user_id = req.user.id;
      if (!title || !data) {
        return res.status(400).json({ message: '标题和素材数据不能为空' });
      }
      const material = await materialService.createMaterial({ title, data, user_id });
      res.status(201).json({ code: 0, msg: '创建成功', data: material });
    } catch (error) {
      res.status(500).json({ message: '创建素材失败', error: error.message });
    }
  }

  // 获取素材列表
  async getAllMaterials(req, res) {
    try {
      const { page, pageSize } = req.query;
      const { count, rows } = await materialService.getMaterials({ page, pageSize });
      res.json({ code: 0, msg: '获取成功', data: { total: count, list: rows, page, pageSize } });
    } catch (error) {
      res.status(500).json({ message: '获取素材列表失败', error: error.message });
    }
  }

  // 获取单个素材
  async getMaterialById(req, res) {
    try {
      const material = await materialService.getMaterialById(req.params.id);
      if (!material) {
        return res.status(404).json({ message: '素材不存在' });
      }
      res.json({ code: 0, msg: '获取成功', data: material });
    } catch (error) {
      res.status(500).json({ message: '获取素材失败', error: error.message });
    }
  }

  // 更新素材
  async updateMaterial(req, res) {
    try {
      const { title } = req.body;
      const material = await materialService.updateMaterial(req.params.id, { title });
      if (!material) {
        return res.status(404).json({ message: '素材不存在' });
      }
      res.json({ code: 0, msg: '更新成功', data: material });
    } catch (error) {
      res.status(500).json({ message: '更新素材失败', error: error.message });
    }
  }

  // 删除素材
  async deleteMaterial(req, res) {
    try {
      const result = await materialService.deleteMaterial(req.params.id);
      if (!result) {
        return res.status(404).json({ message: '素材不存在' });
      }
      res.status(200).json({ code: 0, msg: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '删除素材失败', error: error.message });
    }
  }
}

module.exports = new MaterialController(); 