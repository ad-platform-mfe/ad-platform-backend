const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '素材标题'
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
    comment: '素材类型, 例如: image, video'
  },
  data: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: '素材的Base64编码'
  },
  cover: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '上传用户的ID'
  },
  reviewStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'review'),
    defaultValue: 'pending',
    allowNull: false,
    comment: '审核状态'
  },
  reviewResult: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '机审结果的完整JSON响应'
  },
  manualReviewReason: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '人工审核不通过的原因'
  }
}, {
  tableName: 'materials',
  timestamps: true,
  comment: '素材表'
});

module.exports = Material; 