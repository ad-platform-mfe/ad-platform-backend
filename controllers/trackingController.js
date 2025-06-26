const trackingService = require('../services/trackingService');
const financeService = require('../services/financeService');
const { sequelize } = require('../models');

class TrackingController {
  async trackEvent(req, res) {
    const t = await sequelize.transaction();

    try {
      const { event, url, type, mainCategory, materialId, adGroupId } = req.body;
      const user_id = req.user ? req.user.id : null;
      const ip = req.ip;
      const user_agent = req.headers['user-agent'];

      if (!event || !url) {
        return res.status(400).json({ code: 4001, msg: '请求无效，事件和URL是必填项' });
      }

      if (event !== 'view' && event !== 'click') {
        return res.status(400).json({ code: 4002, msg: '事件类型无效，必须是 "view" 或 "click"' });
      }

      const eventData = {
        event,
        url,
        user_id,
        ip,
        user_agent,
        type,
        mainCategory
      };

      await trackingService.createTrackingEvent(eventData, t);

      if (event === 'click' && user_id && adGroupId) {
        const cpcCost = 0.5;

        await financeService.createSpendTransaction({
          userId: user_id,
          adGroupId,
          materialId,
          amount: cpcCost,
          description: `CPC click for material #${materialId}`,
          meta: { url }
        }, t);
      }

      await t.commit();

      res.status(204).send();
    } catch (error) {
      await t.rollback();
      console.error('事件跟踪出错:', error);
      res.status(500).json({
        code: 5000,
        msg: '服务器内部错误，跟踪事件失败',
        error: error.message
      });
    }
  }

  async getTrackingEvents(req, res) {
    try {
      const { page, pageSize } = req.query;
      const data = await trackingService.getTrackingEvents({ page, pageSize });
      res.json({ code: 0, msg: '获取成功', data });
    } catch (error) {
      console.error('获取跟踪事件列表出错:', error);
      res.status(500).json({
        code: 5001,
        msg: '服务器内部错误，获取跟踪事件列表失败',
        error: error.message
      });
    }
  }
}

module.exports = new TrackingController(); 