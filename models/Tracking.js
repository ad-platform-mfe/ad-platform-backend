const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tracking = sequelize.define('Tracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false // 'view' 或 'click'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // 允许匿名用户
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '类型标签，如 电商、品牌、工具等'
  },
  mainCategory: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '主分类，如 互动广告、创意视频'
  }
}, {
  tableName: 'tracking',
  timestamps: true, // 自动创建 createdAt 和 updatedAt
  updatedAt: false // 我们只关心创建时间
});

module.exports = Tracking;
