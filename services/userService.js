const { User } = require('../models');
const { Op } = require('sequelize');

class UserService {
  // 获取所有用户
  async getAllUsers() {
    return await User.findAll();
  }

  // 根据ID获取用户
  async getUserById(id) {
    return await User.findByPk(id);
  }

  // 根据用户名获取用户
  async getUserByUsername(username) {
    return await User.findOne({
      where: { username }
    });
  }

  // 用户登录验证
  async validateUser(username, password) {
    return await User.findOne({
      where: { username, password }
    });
  }

  // 创建用户
  async createUser(userData) {
    return await User.create(userData);
  }

  // 更新用户
  async updateUser(id, userData) {
    const [updatedRowsCount] = await User.update(userData, {
      where: { id }
    });
    return updatedRowsCount > 0;
  }

  // 删除用户
  async deleteUser(id) {
    const deletedRowsCount = await User.destroy({
      where: { id }
    });
    return deletedRowsCount > 0;
  }

  // 检查用户名是否存在
  async isUsernameExists(username) {
    const user = await User.findOne({
      where: { username }
    });
    return !!user;
  }

  // 更新用户角色
  async updateUserRole(id, role) {
    const [updatedRowsCount] = await User.update({ role }, {
      where: { id }
    });
    return updatedRowsCount > 0;
  }
}

module.exports = new UserService(); 