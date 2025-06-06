const playLogService = require('../services/playLogService');

class PlayLogController {
  // 获取所有播放日志
  async getAllPlayLogs(req, res) {
    try {
      const { keyword } = req.query;

      const playLogs = await playLogService.getAllPlayLogs(keyword);

      res.json({
        code: 0,
        data: playLogs,
        msg: '获取成功'
      });
    } catch (error) {
      console.error('获取播放日志列表错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '获取播放日志失败'
      });
    }
  }

  // 创建播放日志
  async createPlayLog(req, res) {
    try {
      const { user_id, content_id, device_id, schedule_id } = req.body;

      if (!user_id || !content_id || !device_id || !schedule_id) {
        return res.json({
          code: 500,
          data: null,
          msg: '用户ID、内容ID、设备ID和排期ID不能为空'
        });
      }

      // 创建播放日志
      const playLog = await playLogService.createPlayLog({
        user_id,
        content_id,
        device_id,
        schedule_id
      });

      res.json({
        code: 0,
        data: {
          id: playLog.id,
          user_id,
          content_id,
          device_id,
          schedule_id
        },
        msg: '添加播放日志成功'
      });
    } catch (error) {
      console.error('创建播放日志错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '添加播放日志失败'
      });
    }
  }

  // 删除播放日志
  async deletePlayLog(req, res) {
    try {
      const { id } = req.params;

      const success = await playLogService.deletePlayLog(id);

      if (success) {
        res.json({
          code: 0,
          data: null,
          msg: '删除播放日志成功'
        });
      } else {
        res.json({
          code: 500,
          data: null,
          msg: '播放日志不存在'
        });
      }
    } catch (error) {
      console.error('删除播放日志错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '删除播放日志失败'
      });
    }
  }
}

module.exports = new PlayLogController(); 