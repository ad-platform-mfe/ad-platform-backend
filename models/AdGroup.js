const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const AdGroup = sequelize.define('AdGroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '广告组名称'
  },
  mainCategory: {
    type: DataTypes.ENUM('互动广告', '创意视频'),
    allowNull: false,
    comment: '主分类'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '标签，存储为JSON数组'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '创建用户的ID'
  }
}, {
  tableName: 'ad_groups',
  timestamps: true,
  comment: '广告组表'
});

AdGroup.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(AdGroup, { foreignKey: 'user_id' });

module.exports = AdGroup; 