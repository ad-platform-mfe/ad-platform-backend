const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlayLog = sequelize.define('PlayLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  device_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  schedule_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'play_log',
  timestamps: false
});

module.exports = PlayLog; 