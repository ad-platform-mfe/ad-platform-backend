const userService = require('../services/userService');

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
        res.json({
          code: 0,
          data: { username: user.username },
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
      const { username, password, phone, email } = req.body;

      if (!username || !password) {
        return res.json({
          code: 500,
          data: null,
          msg: '必填字段不能为空'
        });
      }

      const success = await userService.updateUser(id, { username, password, phone, email });

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
}

module.exports = new UserController(); 