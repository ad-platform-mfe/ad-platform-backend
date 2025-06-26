const reportService = require('../services/reportService');

class ReportController {
  async createReport(req, res) {
    try {
      const reporterId = req.user.id;
      const { materialId, materialTitle, adGroupId, reason } = req.body;

      const reportData = {
        reporterId,
        materialId,
        materialTitle,
        adGroupId,
        reason
      };

      const report = await reportService.createReport(reportData);
      res.status(201).json({ code: 0, message: '举报成功', data: report });
    } catch (error) {
      res.status(500).json({ message: '举报失败', error: error.message });
    }
  }

  async listReports(req, res) {
    try {
      const { page, pageSize } = req.query;
      const reports = await reportService.getReports({ page, pageSize });
      res.status(200).json({ code: 0, message: '获取成功', data: reports });
    } catch (error) {
      res.status(500).json({ message: '获取举报列表失败', error: error.message });
    }
  }

  async resolveReport(req, res) {
    try {
      const { id } = req.params;
      const updatedReport = await reportService.resolveReport(id);
      if (updatedReport) {
        res.status(200).json({ code: 0, message: '操作成功', data: updatedReport });
      } else {
        res.status(404).json({ message: '举报未找到' });
      }
    } catch (error) {
      res.status(500).json({ message: '操作失败', error: error.message });
    }
  }

  async rejectMaterialFromReport(req, res) {
    try {
      const { id } = req.params;
      const result = await reportService.rejectMaterialFromReport(id);
      if (result) {
        res.status(200).json({ code: 0, message: '操作成功' });
      } else {
        res.status(404).json({ message: '举报未找到或处理失败' });
      }
    } catch (error) {
      res.status(500).json({ message: '操作失败', error: error.message });
    }
  }
}

module.exports = new ReportController(); 