const { Op, fn, col, literal } = require('sequelize');
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

  async getTrendStats() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const results = await Tracking.findAll({
      attributes: [
        [fn('date', col('createdAt')), 'date'],
        [fn('sum', literal(`CASE WHEN event = 'view' THEN 1 ELSE 0 END`)), 'impressions'],
        [fn('sum', literal(`CASE WHEN event = 'click' THEN 1 ELSE 0 END`)), 'clicks'],
      ],
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      group: [fn('date', col('createdAt'))],
      order: [[fn('date', col('createdAt')), 'ASC']],
      raw: true,
    });

    // 生成过去7天的日期标签
    const labels = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const dataMap = new Map(results.map(r => [r.date, r]));

    const impressions = labels.map(label => dataMap.get(label)?.impressions || 0);
    const clicks = labels.map(label => dataMap.get(label)?.clicks || 0);
    const cost = clicks.map(c => c * FIXED_CPC);

    return {
      labels,
      impressions,
      clicks,
      cost,
    };
  }
}

module.exports = new DashboardService(); 