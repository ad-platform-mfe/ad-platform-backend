const reviewService = require('../services/reviewService');

class ReviewController {
  async triggerImageReview(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: '缺少素材ID' });
      }

      const result = await reviewService.reviewImage(id);

      if (!result.success) {
        return res.status(500).json({
          message: 'AI审核服务调用失败',
          error: result.error
        });
      }

      res.status(202).json({ code: 0, message: 'AI审核任务已启动', data: result });

    } catch (error) {
      res.status(500).json({ message: '启动AI审核时发生未知错误', error: error.message });
    }
  }

  async manualReview(req, res) {
    try {
      const { id } = req.params;
      const { reviewStatus, reason } = req.body;

      if (!id || !reviewStatus) {
        return res.status(400).json({ message: '缺少素材ID或审核状态' });
      }

      if (!['approved', 'rejected'].includes(reviewStatus)) {
        return res.status(400).json({ message: '无效的审核状态' });
      }

      const updatedMaterial = await reviewService.submitManualReview(id, { reviewStatus, reason });

      if (!updatedMaterial) {
        return res.status(404).json({ message: '素材不存在' });
      }

      res.status(200).json({ code: 0, message: '人工审核成功', data: updatedMaterial });

    } catch (error) {
      res.status(500).json({ message: '提交人工审核失败', error: error.message });
    }
  }
}

module.exports = new ReviewController(); 