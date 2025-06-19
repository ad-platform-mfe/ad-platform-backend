const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

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
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'image',
    comment: '素材类型, 目前固定为 image'
  },
  data: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: '素材的Base64编码'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '上传用户的ID'
  }
}, {
  tableName: 'materials',
  timestamps: true,
  comment: '素材表'
});

Material.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Material, { foreignKey: 'user_id' });

module.exports = Material; 