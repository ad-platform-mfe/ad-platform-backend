const { Tracking } = require('../models');

class TrackingService {
  async createTrackingEvent(eventData) {
    try {
      const trackingRecord = await Tracking.create(eventData);
      return trackingRecord;
    } catch (error) {
      console.error('创建跟踪事件时出错:', error);
      throw error;
    }
  }

  async getTrackingEvents({ page = 1, pageSize = 10 }) {
    try {
      const offset = (page - 1) * pageSize;
      const { count, rows } = await Tracking.findAndCountAll({
        offset,
        limit: parseInt(pageSize, 10),
        order: [['createdAt', 'DESC']]
      });
      return { total: count, list: rows, page: parseInt(page, 10), pageSize: parseInt(pageSize, 10) };
    } catch (error) {
      console.error('获取跟踪事件时出错:', error);
      throw error;
    }
  }
}

module.exports = new TrackingService(); 