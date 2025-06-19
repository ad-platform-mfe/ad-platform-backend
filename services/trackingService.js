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
}

module.exports = new TrackingService(); 