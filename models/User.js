const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  verification_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  code_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('advertisers', 'admin'),
    allowNull: false,
    defaultValue: 'advertisers',
    comment: '用户角色'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User; 