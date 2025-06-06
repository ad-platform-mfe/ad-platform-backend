const { PlayLog, User, Content, Device, Schedule } = require('../models');
const { Op } = require('sequelize');

class PlayLogService {
  // 获取所有播放日志
  async getAllPlayLogs(keyword) {
    const whereCondition = {};

    if (keyword) {
      whereCondition[Op.or] = [
        { '$user.username$': { [Op.like]: `%${keyword}%` } },
        { '$content.title$': { [Op.like]: `%${keyword}%` } },
        { '$device.name$': { [Op.like]: `%${keyword}%` } }
      ];
    }

    return await PlayLog.findAll({
      where: whereCondition,
      include: [
        { model: User, as: 'user', attributes: ['username'] },
        { model: Content, as: 'content', attributes: ['title'] },
        { model: Device, as: 'device', attributes: ['name'] },
        { model: Schedule, as: 'schedule', attributes: ['start_time', 'end_time'] }
      ],
      order: [['id', 'DESC']]
    });
  }

  // 根据ID获取播放日志
  async getPlayLogById(id) {
    return await PlayLog.findByPk(id);
  }

  // 创建播放日志
  async createPlayLog(playLogData) {
    return await PlayLog.create(playLogData);
  }

  // 删除播放日志
  async deletePlayLog(id) {
    const deletedRowsCount = await PlayLog.destroy({
      where: { id }
    });
    return deletedRowsCount > 0;
  }
}

module.exports = new PlayLogService(); 