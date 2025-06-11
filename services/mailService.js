const nodemailer = require('nodemailer');
const mailConfig = require('../config/mailer');

// 创建一个Nodemailer的"传输器"（transporter）
// 这是实际负责发送邮件的对象
const transporter = nodemailer.createTransport(mailConfig);

/**
 * 发送邮件的函数
 * @param {string} to - 收件人的邮箱地址
 * @param {string} subject - 邮件主题
 * @param {string} html - 邮件内容 (支持HTML)
 */
async function sendMail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"${mailConfig.auth.user}" <${mailConfig.auth.user}>`, // 发件人信息
      to,       // 收件人
      subject,  // 主题
      html      // HTML内容
    });
    console.log('邮件发送成功:', info.messageId);
    return info;
  } catch (error) {
    console.error('邮件发送失败:', error);
    throw new Error('邮件发送失败，请检查配置或联系管理员。');
  }
}

module.exports = {
  sendMail
}; 