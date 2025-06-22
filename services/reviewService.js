const tencentcloud = require('tencentcloud-sdk-nodejs');
const { secretId, secretKey, ims: { region } } = require('../config/tencentCloud');
const { Material } = require('../models');

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

    // 更新状态和原因
    return await material.update({
      reviewStatus: reviewData.reviewStatus,
      manualReviewReason: reviewData.reason || null,
    });
  }
}

module.exports = new ReviewService(); 