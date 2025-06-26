const financeService = require('../services/financeService');

// 获取交易明细
const listTransactions = async (req, res) => {
  try {
    const options = {
      userId: req.user.id, // 从认证中间件获取用户ID
      ...req.query, // 其他查询参数如 startDate, endDate, adGroupId, page, pageSize
    };
    const result = await financeService.getTransactions(options);
    res.json({ code: 0, data: result });
  } catch (error) {
    res.status(500).json({ code: 1, message: error.message });
  }
};

module.exports = {
  listTransactions,
}; 