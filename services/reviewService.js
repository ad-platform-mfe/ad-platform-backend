const tencentcloud = require('tencentcloud-sdk-nodejs');
const { secretId, secretKey, ims: { region } } = require('../config/tencentCloud');
const { Material } = require('../models');
const messageService = require('./messageService'); // 引入 messageService

const ImsClient = tencentcloud.ims.v20201229.Client;

const clientConfig = {
  credential: {
    secretId,
    secretKey,
  },
  region,
  profile: {
    httpProfile: {
      endpoint: "ims.tencentcloudapi.com",
    },
  },
};

const client = new ImsClient(clientConfig);

class ReviewService {
  async reviewImage(materialId) {
    const material = await Material.findByPk(materialId);
    if (!material || material.type !== 'image') {
      throw new Error('素材不存在或非图片类型');
    }

    // 从Base64数据中移除头部信息
    const base64Data = material.data.split(';base64,').pop();

    const params = {
      FileContent: base64Data,
    };

    try {
      const response = await client.ImageModeration(params);

      // 根据腾讯云返回结果更新素材状态
      const result = response.Suggestion; // "Pass", "Review", "Block"
      let reviewStatus = 'pending';
      if (result === 'Pass') {
        reviewStatus = 'approved';
      } else if (result === 'Block') {
        reviewStatus = 'rejected';
      } else if (result === 'Review') {
        reviewStatus = 'review';
      }

      await material.update({
        reviewStatus,
        reviewResult: response, // 存储完整的返回结果
      });

      return { success: true, materialId, reviewStatus, details: response };

    } catch (err) {
      console.error("腾讯云审核API调用失败", err);
      // 返回一个包含具体错误信息的对象
      return {
        success: false,
        error: {
          message: err.message,
          code: err.code,
          requestId: err.requestId
        }
      };
    }
  }

  /**
   * 提交人工审核结果
   * @param {number} materialId - 素材ID
   * @param {object} reviewData - 审核数据
   * @param {'approved' | 'rejected'} reviewData.reviewStatus - 审核结果
   * @param {string} [reviewData.reason] - 人工审核的原因
   */
  async submitManualReview(materialId, reviewData) {
    const material = await Material.findByPk(materialId);
    if (!material) {
      return null;
    }

    // --- DEBUG LOG START ---
    console.log(`[DEBUG] Found material for review. ID: ${material.id}, Title: ${material.title}`);
    console.log(`[DEBUG] Material's owner User ID: ${material.user_id}`);
    // --- DEBUG LOG END ---

    // 根据审核状态发送不同通知
    if (reviewData.reviewStatus === 'approved') {
      try {
        await messageService.createMessage({
          userId: material.user_id,
          title: '素材审核通过',
          content: `恭喜！您的素材 "${material.title}" 已成功通过审核。`,
          type: 'review_approved',
          meta: { materialId: material.id }
        });
      } catch (error) {
        console.error('创建审核通过通知消息失败:', error);
      }
    } else if (reviewData.reviewStatus === 'rejected') {
      try {
        await messageService.createMessage({
          userId: material.user_id,
          title: '素材审核被驳回',
          content: `很遗憾，您的素材 "${material.title}" 未能通过审核。原因：${reviewData.reason || '无'}`,
          type: 'review_rejected',
          meta: { materialId: material.id, reason: reviewData.reason }
        });
      } catch (error) {
        console.error('创建审核驳回通知消息失败:', error);
      }
    }

    // 更新状态和原因
    return await material.update({
      reviewStatus: reviewData.reviewStatus,
      manualReviewReason: reviewData.reason || null,
    });
  }
}

module.exports = new ReviewService(); 