const commentService = require('../services/commentService');

class CommentController {
  async createComment(req, res) {
    try {
      const userId = req.user.id;
      const materialId = req.params.id;
      const { content, parentId } = req.body;
      const comment = await commentService.createComment({ userId, materialId, content, parentId });
      res.status(201).json({ code: 0, message: '评论成功', data: comment });
    } catch (error) {
      res.status(500).json({ message: '评论失败', error: error.message });
    }
  }

  async getCommentsByMaterial(req, res) {
    try {
      const materialId = req.params.id;
      const { page, pageSize } = req.query;
      const comments = await commentService.getCommentsByMaterial(materialId, { page, pageSize });
      res.status(200).json({ code: 0, message: '获取成功', data: comments });
    } catch (error) {
      res.status(500).json({ message: '获取评论列表失败', error: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      const userId = req.user.id;
      const commentId = req.params.commentId;
      const result = await commentService.deleteComment(userId, commentId);
      if (result > 0) {
        res.status(200).json({ code: 0, message: '删除成功' });
      } else {
        res.status(404).json({ code: 1, message: '评论不存在或无权删除' });
      }
    } catch (error) {
      res.status(500).json({ message: '删除失败', error: error.message });
    }
  }
}

module.exports = new CommentController();
