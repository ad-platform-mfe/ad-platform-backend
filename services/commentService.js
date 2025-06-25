const { Comment, User } = require('../models');

class CommentService {
  async createComment(data) {
    const comment = await Comment.create(data);
    // 返回包含用户信息的新评论
    return await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }]
    });
  }

  async getCommentsByMaterial(materialId, { page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    return await Comment.findAndCountAll({
      where: { materialId, parentId: null }, // 只获取顶级评论
      offset,
      limit: parseInt(pageSize, 10),
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
        {
          model: Comment,
          as: 'Replies',
          include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }]
        }
      ]
    });
  }

  async deleteComment(userId, commentId) {
    // 只能删除自己的评论
    const result = await Comment.destroy({
      where: { id: commentId, userId: userId }
    });
    return result;
  }
}

module.exports = new CommentService(); 