const { Report, Material, AdGroup, User, sequelize } = require('../models');

class ReportService {
  async createReport(data) {
    const report = await Report.create(data);
    return report;
  }

  async getReports({ page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    return await Report.findAndCountAll({
      offset,
      limit: parseInt(pageSize, 10),
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
        { model: Material }
      ]
    });
  }

  async resolveReport(reportId) {
    const report = await Report.findByPk(reportId);
    if (!report) return null;

    report.status = 'resolved';
    await report.save();
    return report;
  }

  async rejectMaterialFromReport(reportId) {
    return sequelize.transaction(async (t) => {
      const report = await Report.findByPk(reportId, { transaction: t });
      if (!report) {
        throw new Error('Report not found');
      }

      // 1. Mark report as resolved
      report.status = 'resolved';
      await report.save({ transaction: t });

      const material = await Material.findByPk(report.materialId, {
        include: [{ model: AdGroup }],
        transaction: t
      });

      if (!material) {
        // Material might have been deleted, which is fine.
        return true;
      }

      // 2. Update material status
      material.reviewStatus = 'rejected';
      await material.save({ transaction: t });

      // 3. Remove material from all associated ad groups
      if (material.AdGroups && material.AdGroups.length > 0) {
        await material.setAdGroups([], { transaction: t });
      }

      return true;
    });
  }
}

module.exports = new ReportService(); 