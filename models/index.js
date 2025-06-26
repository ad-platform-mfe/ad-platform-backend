const sequelize = require('../config/database');
const User = require('./User');
const Material = require('./Material');
const AdGroup = require('./AdGroup');
const AdGroupMaterial = require('./AdGroupMaterial');
const PlayLog = require('./PlayLog');
const Tracking = require('./Tracking');
const Favorite = require('./Favorite');
const Comment = require('./Comment');
const Report = require('./Report');
const Message = require('./Message');
const FinanceTransaction = require('./FinanceTransaction');

// 定义模型之间的关系
// User-Material (一对多)
User.hasMany(Material, { foreignKey: 'user_id' });
Material.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Material-AdGroup (多对多)
Material.belongsToMany(AdGroup, { through: AdGroupMaterial, foreignKey: 'material_id' });
AdGroup.belongsToMany(Material, { through: AdGroupMaterial, foreignKey: 'ad_group_id', as: 'Materials' });

// User-AdGroup (一对多)
User.hasMany(AdGroup, { foreignKey: 'user_id' });
AdGroup.belongsTo(User, { foreignKey: 'user_id' });

// Favorite: User-Material (多对多)
User.belongsToMany(Material, { through: Favorite, as: 'FavoritedMaterials', foreignKey: 'userId' });
Material.belongsToMany(User, { through: Favorite, as: 'FavoritingUsers', foreignKey: 'materialId' });

// Comment: User-Material (一对多, 一个用户可以对一个素材有多个评论)
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Material.hasMany(Comment, { foreignKey: 'materialId' });
Comment.belongsTo(Material, { foreignKey: 'materialId' });

// Comment 自关联用于回复
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parentId', useJunctionTable: false });
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parentId' });

// Report 关联
Report.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
Report.belongsTo(Material, { foreignKey: 'materialId' });

// Message 关联
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// FinanceTransaction 关联
FinanceTransaction.belongsTo(User, { foreignKey: 'userId' });
FinanceTransaction.belongsTo(AdGroup, { foreignKey: 'adGroupId' });
FinanceTransaction.belongsTo(Material, { foreignKey: 'materialId' });

User.hasMany(FinanceTransaction, { foreignKey: 'userId' });
AdGroup.hasMany(FinanceTransaction, { foreignKey: 'adGroupId' });
Material.hasMany(FinanceTransaction, { foreignKey: 'materialId' });

// 初始化数据库
const initDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('数据库同步成功');
  } catch (error) {
    console.error('数据库同步失败:', error);
  }
};

module.exports = {
  sequelize,
  initDatabase,
  User,
  Material,
  AdGroup,
  PlayLog,
  Tracking,
  Favorite,
  Comment,
  Report,
  Message,
  FinanceTransaction
}; 