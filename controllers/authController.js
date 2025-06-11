const userService = require('../services/userService');
const mailService = require('../services/mailService');
const { User } = require('../models');

class AuthController {
  // 发送邮箱验证码
  async sendVerificationCode(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ msg: '邮箱地址不能为空' });
      }

      // 1. 生成6位随机数字验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 2. 设置10分钟后过期
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // 3. 查找或创建用户，并更新验证码
      let user = await User.findOne({ where: { email } });
      if (!user) {
        // 如果用户不存在，我们创建一个临时的
        user = await User.create({ email });
      }

      await user.update({
        verification_code: verificationCode,
        code_expires_at: expiresAt
      });

      // 4. 发送邮件
      const subject = '【广告管理系统】您的登录验证码';
      const html = `
        <p>您好！</p>
        <p>您的登录验证码是：<b>${verificationCode}</b></p>
        <p>该验证码将在10分钟内失效，请尽快使用。</p>
      `;
      await mailService.sendMail(email, subject, html);

      res.json({
        code: 0,
        msg: '验证码已发送至您的邮箱，请注意查收。'
      });

    } catch (error) {
      console.error('发送验证码错误:', error);
      res.status(500).json({ msg: '发送验证码失败，请稍后重试' });
    }
  }
}

module.exports = new AuthController(); 