const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FinanceTransaction = sequelize.define('FinanceTransaction', {
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
  adGroupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'AdGroups',
      key: 'id',
    },
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'Materials',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(12, 4), // 12位总长，4位小数，用于精确记录金额
    allowNull: false,
  },
  transactionType: {
    type: DataTypes.ENUM('spend', 'refund', 'recharge'),
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'finance_transactions',
});

module.exports = FinanceTransaction; 