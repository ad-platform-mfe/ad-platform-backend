const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class UserController {
  // 用户注册
  async register(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.json({
          code: 500,
          data: null,
          msg: '用户名和密码不能为空'
        });
      }

      // 检查用户名是否已存在
      const isExists = await userService.isUsernameExists(username);
      if (isExists) {
        return res.json({
          code: 500,
          data: null,
          msg: '用户名已存在'
        });
      }

      // 创建用户
      await userService.createUser({ username, password });

      res.json({
        code: 0,
        data: null,
        msg: '注册成功'
      });
    } catch (error) {
      console.error('注册错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '注册失败，请稍后重试'
      });
    }
  }

  // 用户登录
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.json({
          code: 500,
          data: null,
          msg: '用户名和密码不能为空'
        });
      }

      // 验证用户
      const user = await userService.validateUser(username, password);

      if (user) {
        // 用户验证成功，生成JWT
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          jwtConfig.secretKey,
          { expiresIn: jwtConfig.expiresIn }
        );

        res.json({
          code: 0,
          data: { token },
          msg: '登录成功'
        });
      } else {
        res.json({
          code: 500,
          data: null,
          msg: '用户名或密码错误'
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '登录失败，请稍后重试'
      });
    }
  }

  // 用户登出
  async logout(req, res) {
    res.json({
      code: 0,
      msg: '登出成功'
    });
  }

  // 获取当前登录用户的信息
  async getMe(req, res) {
    // authMiddleware 确保了 req.user 的存在
    const userId = req.user.id;
    try {
      const user = await userService.getUserById(userId);
      if (user) {
        const { id, username, email, phone, role } = user;
        res.json({
          code: 0,
          data: { id, username, email, phone, role },
          msg: '获取用户信息成功'
        });
      } else {
        res.status(404).json({ code: 404, msg: '用户不存在' });
      }
    } catch (error) {
      res.status(500).json({ code: 500, msg: '获取用户信息失败' });
    }
  }

  // 更新当前登录用户的信息
  async updateMe(req, res) {
    const userId = req.user.id;
    const { username, email, phone } = req.body;

    // 不允许通过此接口更新密码或角色
    const updateData = { username, email, phone };

    try {
      const [success] = await userService.updateUser(userId, updateData);
      if (success) {
        res.json({ code: 0, msg: '更新个人信息成功' });
      } else {
        res.status(404).json({ code: 404, msg: '用户不存在' });
      }
    } catch (error) {
      console.error('更新个人信息错误:', error);
      res.status(500).json({ code: 500, msg: '更新个人信息失败', error: error.message });
    }
  }

  // 获取所有用户
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json({
        code: 0,
        data: users,
        msg: '获取成功'
      });
    } catch (error) {
      console.error('获取用户列表错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '获取客户列表失败'
      });
    }
  }

  // 创建用户
  async createUser(req, res) {
    try {
      const { username, password, phone, email } = req.body;

      if (!username || !password || !phone || !email) {
        return res.json({
          code: 500,
          data: null,
          msg: '必填字段不能为空'
        });
      }

      // 检查用户名是否已存在
      const isExists = await userService.isUsernameExists(username);
      if (isExists) {
        return res.json({
          code: 500,
          data: null,
          msg: '用户名已存在'
        });
      }

      // 创建用户
      const user = await userService.createUser({ username, password, phone, email });

      res.json({
        code: 0,
        data: {
          id: user.id,
          username,
          phone,
          email
        },
        msg: '添加客户成功'
      });
    } catch (error) {
      console.error('创建用户错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '添加客户失败，请稍后重试'
      });
    }
  }

  // 更新用户
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, password, phone, email, role } = req.body;

      if (!username) {
        return res.json({
          code: 400,
          data: null,
          msg: '用户名不能为空'
        });
      }

      const updateData = { username, phone, email, role };
      // 只有当传入 password 且不为空时，才更新密码
      if (password) {
        updateData.password = password;
      }

      const success = await userService.updateUser(id, updateData);

      if (success) {
        res.json({
          code: 0,
          data: null,
          msg: '更新客户信息成功'
        });
      } else {
        res.json({
          code: 500,
          data: null,
          msg: '用户不存在'
        });
      }
    } catch (error) {
      console.error('更新用户错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '更新客户信息失败'
      });
    }
  }

  // 删除用户
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const success = await userService.deleteUser(id);

      if (success) {
        res.json({
          code: 0,
          data: null,
          msg: '删除客户成功'
        });
      } else {
        res.json({
          code: 500,
          data: null,
          msg: '用户不存在'
        });
      }
    } catch (error) {
      console.error('删除用户错误:', error);
      res.json({
        code: 500,
        data: null,
        msg: '删除客户失败'
      });
    }
  }

  // 更新用户角色
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !['advertisers', 'admin'].includes(role)) {
        return res.status(400).json({ code: 400, msg: '无效的角色' });
      }

      const success = await userService.updateUserRole(id, role);

      if (success) {
        res.json({ code: 0, msg: '更新用户角色成功' });
      } else {
        res.status(404).json({ code: 404, msg: '用户不存在' });
      }
    } catch (error) {
      console.error('更新用户角色错误:', error);
      res.status(500).json({ code: 500, msg: '更新用户角色失败' });
    }
  }
}

module.exports = new UserController();