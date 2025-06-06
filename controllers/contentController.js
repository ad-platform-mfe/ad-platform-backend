const contentService = require('../services/contentService.js');

class ContentController {
  // 获取所有广告内容
  async getAllContents(req, res) {
    try {
      const contents = await contentService.getAllContents();
      res.json({
        code: 0,
        data: contents,
        msg: '获取成功'
      });
    } catch (error) {
      console.error('获取广告内容列表错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '获取广告内容列表失败'
      });
    }
  }

  // 创建广告内容
  async createContent(req, res) {
    try {
      const { title, text, type, file_url, upload_time } = req.body;

      if (!title || !file_url || !text || !type || !upload_time) {
        return res.json({
          code: 500,
          data: null,
          msg: '必填字段不能为空'
        });
      }

      // 检查标题是否已存在
      const isExists = await contentService.isTitleExists(title);
      if (isExists) {
        return res.json({
          code: 500,
          data: null,
          msg: '广告标题已存在'
        });
      }

      // 创建广告内容
      const content = await contentService.createContent({
        title,
        text,
        type,
        file_url,
        upload_time: new Date(upload_time)
      });

      res.json({
        code: 0,
        data: {
          id: content.id,
          title,
          text,
          type,
          file_url,
          upload_time: content.upload_time
        },
        msg: '添加广告内容成功'
      });
    } catch (error) {
      console.error('创建广告内容错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '添加广告内容失败，请稍后重试'
      });
    }
  }

  // 更新广告内容
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const { title, text, type, file_url, upload_time } = req.body;

      if (!title || !file_url || !text || !type || !upload_time) {
        return res.json({
          code: 500,
          data: null,
          msg: '必填字段不能为空'
        });
      }

      const success = await contentService.updateContent(id, {
        title,
        text,
        type,
        file_url,
        upload_time: new Date(upload_time)
      });

      if (success) {
        res.json({
          code: 0,
          data: null,
          msg: '更新广告内容成功'
        });
      } else {
        res.json({
          code: 500,
          data: null,
          msg: '广告内容不存在'
        });
      }
    } catch (error) {
      console.error('更新广告内容错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '更新广告内容失败'
      });
    }
  }

  // 删除广告内容
  async deleteContent(req, res) {
    try {
      const { id } = req.params;

      const success = await contentService.deleteContent(id);

      if (success) {
        res.json({
          code: 0,
          data: null,
          msg: '删除广告内容成功'
        });
      } else {
        res.json({
          code: 500,
          data: null,
          msg: '广告内容不存在'
        });
      }
    } catch (error) {
      console.error('删除广告内容错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '删除广告内容失败'
      });
    }
  }
}

module.exports = new ContentController(); 