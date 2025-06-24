/**
 * 广告组素材关联表(中间表模型)
 * 它只包含两个外键，分别指向 ad_groups 表和 materials 表
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdGroupMaterial = sequelize.define('AdGroupMaterial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ad_group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ad_groups',
      key: 'id'
    }
  },
  material_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'materials',
      key: 'id'
    }
  }
}, {
  tableName: 'ad_group_materials',
  timestamps: true // 保持 createdAt 和 updatedAt
});

module.exports = AdGroupMaterial; 