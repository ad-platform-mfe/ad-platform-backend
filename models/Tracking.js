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
  }
}, {
  tableName: 'tracking',
  timestamps: true, // 自动创建 createdAt 和 updatedAt
  updatedAt: false // 我们只关心创建时间
});

module.exports = Tracking;
