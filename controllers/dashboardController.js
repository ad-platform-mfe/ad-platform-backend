const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getKpiStats(req, res) {
    try {
      const stats = await dashboardService.getKpiStats();
      res.status(200).json({ code: 0, msg: '获取成功', data: stats });
    } catch (error) {
      res.status(500).json({ message: '获取看板KPI数据失败', error: error.message });
    }
  }
}

module.exports = new DashboardController(); 