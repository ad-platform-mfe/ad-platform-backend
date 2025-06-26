const messageService = require('../services/messageService');

// 获取当前用户的消息列表
const listMessages = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const messages = await messageService.getMessagesByUserId(req.user.id, { page, pageSize });
    res.json({ code: 0, data: messages });
  } catch (error) {
    res.status(500).json({ code: 1, message: error.message });
  }
};

// 将单条消息标记为已读
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await messageService.markMessageAsRead(id, req.user.id);
    res.json({ code: 0, message: '消息已标记为已读' });
  } catch (error) {
    res.status(500).json({ code: 1, message: error.message });
  }
};

// 将所有未读消息标记为已读
const markAllAsRead = async (req, res) => {
  try {
    await messageService.markAllMessagesAsRead(req.user.id);
    res.json({ code: 0, message: '所有消息已标记为已读' });
  } catch (error) {
    res.status(500).json({ code: 1, message: error.message });
  }
};

module.exports = {
  listMessages,
  markAsRead,
  markAllAsRead,
}; 