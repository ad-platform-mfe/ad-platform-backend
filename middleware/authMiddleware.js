const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      msg: '认证失败：请求头中缺少有效的Token'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secretKey);
    req.user = decoded; // 将解码后的用户信息存入req
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      msg: '认证失败：无效的Token'
    });
  }
}

// 可选认证中间件
authMiddleware.optional = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secretKey);
    req.user = decoded;
  } catch (error) {
    // Token无效，但我们不希望请求失败，只是继续执行
  }

  next();
};

module.exports = authMiddleware;
