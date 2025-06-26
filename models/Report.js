const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materials',
      key: 'id'
    }
  },
  materialTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adGroupId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'resolved'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  tableName: 'reports',
  timestamps: true
});

module.exports = Report; 