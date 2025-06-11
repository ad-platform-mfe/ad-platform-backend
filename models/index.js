const sequelize = require('../config/database');
const User = require('./User');
const Content = require('./Content');
const PlayLog = require('./PlayLog');

// 定义模型关联关系
PlayLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PlayLog.belongsTo(Content, { foreignKey: 'content_id', as: 'content' });

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
  User,
  Content,
  PlayLog,
  initDatabase
}; 