'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // 消息类型, 例如: 'review_approved', 'system_alert'
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read'),
    defaultValue: 'unread',
    allowNull: false,
  },
  meta: {
    type: DataTypes.JSON, // 存储额外关联信息，如素材ID
    allowNull: true,
  },
}, {
  // Sequelize 会自动添加 createdAt 和 updatedAt 字段，这里无需额外配置
});

module.exports = Message; 