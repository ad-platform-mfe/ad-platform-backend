const { FinanceTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * 创建一笔广告花费交易
 * @param {object} data - 交易数据
 * @param {object} [transaction] - Sequelize 事务对象
 * @returns {Promise<FinanceTransaction>}
 */
const createSpendTransaction = async (data, transaction = null) => {
  return FinanceTransaction.create(
    {
      ...data,
      transactionType: 'spend',
      amount: -Math.abs(data.amount), // 确保花费金额为负数
    },
    { transaction }
  );
};

/**
 * 获取交易明细列表
 * @param {object} options - 查询选项
 * @param {number} options.userId - 用户ID
 * @param {string} [options.startDate] - YYYY-MM-DD
 * @param {string} [options.endDate] - YYYY-MM-DD
 * @param {number} [options.adGroupId] - 广告组ID
 * @param {number} [options.page]
 * @param {number} [options.pageSize]
 */
const getTransactions = async (options) => {
  const { userId, startDate, endDate, adGroupId, page = 1, pageSize = 10 } = options;
  const where = { userId };
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(pageSize, 10) || 10;

  if (startDate && endDate) {
    where.transactionDate = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  }
  if (adGroupId) {
    where.adGroupId = adGroupId;
  }

  const { count, rows } = await FinanceTransaction.findAndCountAll({
    where,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    order: [['transactionDate', 'DESC']],
  });

  return { count, rows };
};

module.exports = {
  createSpendTransaction,
  getTransactions,
}; 