function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      code: 403,
      msg: '访问被拒绝：需要管理员权限'
    });
  }
}

module.exports = adminOnly; 