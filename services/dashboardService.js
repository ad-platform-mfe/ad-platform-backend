const { Op } = require('sequelize');
const Tracking = require('../models/Tracking');

const FIXED_CPC = 0.5; // 假设固定的CPC为0.5元

class DashboardService {
  async getKpiStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // 获取今天和昨天的数据
    const todayImpressions = await Tracking.count({
      where: { event: 'view', createdAt: { [Op.gte]: today, [Op.lt]: tomorrow } }
    });
    const todayClicks = await Tracking.count({
      where: { event: 'click', createdAt: { [Op.gte]: today, [Op.lt]: tomorrow } }
    });

    const yesterdayImpressions = await Tracking.count({
      where: { event: 'view', createdAt: { [Op.gte]: yesterday, [Op.lt]: today } }
    });
    const yesterdayClicks = await Tracking.count({
      where: { event: 'click', createdAt: { [Op.gte]: yesterday, [Op.lt]: today } }
    });

    // 计算指标
    const todayCost = todayClicks * FIXED_CPC;
    const yesterdayCost = yesterdayClicks * FIXED_CPC;
    const cpc = FIXED_CPC;

    // 计算趋势
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      cost: {
        value: todayCost,
        trend: calculateTrend(todayCost, yesterdayCost),
      },
      impressions: {
        value: todayImpressions,
        trend: calculateTrend(todayImpressions, yesterdayImpressions),
      },
      clicks: {
        value: todayClicks,
        trend: calculateTrend(todayClicks, yesterdayClicks),
      },
      cpc: {
        value: cpc,
        trend: 0, // CPC是固定的，所以趋势为0
      },
    };
  }
}

module.exports = new DashboardService(); 