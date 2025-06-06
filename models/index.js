const sequelize = require('../config/database');
const User = require('./User');
const Device = require('./Device');
const Content = require('./Content');
const Schedule = require('./Schedule');
const PlayLog = require('./PlayLog');

// 定义模型关联关系
Schedule.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });
Device.hasMany(Schedule, { foreignKey: 'device_id', as: 'schedules' });

PlayLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PlayLog.belongsTo(Content, { foreignKey: 'content_id', as: 'content' });
PlayLog.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });
PlayLog.belongsTo(Schedule, { foreignKey: 'schedule_id', as: 'schedule' });

// 初始化数据库
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步表结构
    await sequelize.sync({ alter: true });
    console.log('数据库表同步完成');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Device,
  Content,
  Schedule,
  PlayLog,
  initDatabase
}; 