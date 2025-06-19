const trackingService = require('../services/trackingService');

class TrackingController {
  async trackEvent(req, res) {
    try {
      const { event, url } = req.body;
      const user_id = req.user ? req.user.id : null;
      const ip = req.ip;
      const user_agent = req.headers['user-agent'];

      if (!event || !url) {
        return res.status(400).json({ message: '事件和URL是必需的' });
      }

      if (event !== 'view' && event !== 'click') {
        return res.status(400).json({ message: '事件类型必须是 "view" 或 "click"' });
      }

      const eventData = {
        event,
        url,
        user_id,
        ip,
        user_agent
      };

      await trackingService.createTrackingEvent(eventData);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: '事件跟踪出错', error: error.message });
    }
  }
}

module.exports = new TrackingController(); 