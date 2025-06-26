const { Message } = require('../models');

/**
 * 创建一条新消息
 * @param {object} messageData - 消息数据
 * @returns {Promise<Message>}
 */
const createMessage = async (messageData) => {
  // --- DEBUG LOG START ---
  console.log('[DEBUG] Attempting to create message with data:', messageData);
  // --- DEBUG LOG END ---
  return Message.create(messageData);
};

/**
 * 根据用户ID获取消息列表（分页）
 * @param {number} userId - 用户ID
 * @param {object} pagination - 分页参数 { page, pageSize }
 * @returns {Promise<{count: number, rows: Message[]}>}
 */
const getMessagesByUserId = async (userId, { page = 1, pageSize = 10 }) => {
  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  return Message.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};

/**
 * 将单条消息标记为已读
 * @param {number} id - 消息ID
 * @param {number} userId - 用户ID，确保用户只能修改自己的消息
 * @returns {Promise<[number]>}
 */
const markMessageAsRead = async (id, userId) => {
  return Message.update({ status: 'read' }, { where: { id, userId } });
};

/**
 * 将用户的所有未读消息标记为已读
 * @param {number} userId - 用户ID
 * @returns {Promise<[number]>}
 */
const markAllMessagesAsRead = async (userId) => {
  return Message.update({ status: 'read' }, { where: { userId, status: 'unread' } });
};

module.exports = {
  createMessage,
  getMessagesByUserId,
  markMessageAsRead,
  markAllMessagesAsRead,
}; 