module.exports = {
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE === 'true', // 将字符串转为布尔值
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
  }
}; 