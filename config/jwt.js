module.exports = {
  secretKey: process.env.JWT_SECRET_KEY || 'your-default-secret-key-for-development',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d' // 默认设置为 7 天
};

