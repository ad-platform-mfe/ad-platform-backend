const mailService = require('../services/mailService');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { Op } = require('sequelize');

class AuthController {
  // 发送邮箱验证码
  async sendVerificationCode(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ msg: '邮箱地址不能为空' });
      }

      // 1. 生成4位随机数字验证码
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

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
      const subject = '【汇量千川】您的登录验证码';
      const html = `
      <div style="background-color: #0a0a1a; color: #f0f0f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; text-align: center; background-image: url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80'); background-size: cover; background-position: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: rgba(10, 10, 30, 0.85); border: 1px solid #4a4a8a; border-radius: 12px; overflow: hidden; backdrop-filter: blur(10px);">
          <div style="padding: 30px;">
            <h1 style="font-size: 24px; color: #ffffff; margin: 0 0 20px;">星链矩阵投放</h1>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px;">您好！感谢您使用本系统。您的登录验证码是：</p>
            <div style="background-color: #1a1a3a; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <p style="font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px; margin: 0; text-shadow: 0 0 10px #6a6aff;">
                ${verificationCode}
              </p>
            </div>
            <p style="font-size: 14px; color: #a0a0c0; margin: 0;">此验证码将在 10 分钟内失效，请勿泄露给他人。</p>
          </div>
          <div style="background-color: rgba(0, 0, 0, 0.3); padding: 15px; font-size: 12px; color: #7a7a9a; text-align: center;">
            &copy; ${new Date().getFullYear()} 星链矩阵. All rights reserved.
          </div>
        </div>
      </div>
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

  // 使用邮箱和验证码登录
  async loginWithCode(req, res) {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ msg: '邮箱和验证码不能为空' });
      }

      // 1. 查找用户并验证验证码
      const user = await User.findOne({
        where: {
          email,
          verification_code: code,
          code_expires_at: {
            [Op.gt]: new Date() // 检查验证码是否未过期
          }
        }
      });

      // 2. 如果找不到用户或验证码无效
      if (!user) {
        return res.status(400).json({ msg: '验证码错误或已失效' });
      }

      // 3. 验证成功，清空验证码防止重复使用
      await user.update({
        verification_code: null,
        code_expires_at: null
      });

      // 4. 生成JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.secretKey,
        { expiresIn: jwtConfig.expiresIn }
      );

      // 5. 返回Token
      res.json({
        code: 0,
        data: { token },
        msg: '登录成功'
      });

    } catch (error) {
      console.error('验证码登录错误:', error);
      res.status(500).json({ msg: '登录失败，请稍后重试' });
    }
  }

  // 重置密码
  async resetPassword(req, res) {
    try {
      const { email, code, password } = req.body;
      if (!email || !code || !password) {
        return res.status(400).json({ msg: '邮箱、验证码和新密码不能为空' });
      }

      // 1. 查找用户并验证验证码
      const user = await User.findOne({
        where: {
          email,
          verification_code: code,
          code_expires_at: {
            [Op.gt]: new Date()
          }
        }
      });

      // 2. 如果找不到用户或验证码无效
      if (!user) {
        return res.status(400).json({ msg: '验证码错误或已失效' });
      }

      // 3. 更新密码并清空验证码
      await user.update({
        password: password, // 注意：这里存储的是明文密码
        verification_code: null,
        code_expires_at: null
      });

      res.json({
        code: 0,
        msg: '密码重置成功'
      });

    } catch (error) {
      console.error('重置密码错误:', error);
      res.status(500).json({ msg: '密码重置失败，请稍后重试' });
    }
  }
}

module.exports = new AuthController();