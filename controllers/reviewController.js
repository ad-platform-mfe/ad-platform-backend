const reviewService = require('../services/reviewService');

class ReviewController {
  async triggerImageReview(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: '缺少素材ID' });
      }

      await reviewService.reviewImage(id);

      // 注意：这里是立即返回，告知前端已开始审核。
      // 真实结果由ReviewService异步更新到数据库。
      res.status(202).json({ message: 'AI审核任务已启动' });

    } catch (error) {
      res.status(500).json({ message: '启动AI审核失败', error: error.message });
    }
  }
}

module.exports = new ReviewController(); 