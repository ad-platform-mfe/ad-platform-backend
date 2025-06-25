const sequelize = require('../config/database');
const User = require('./User');
const Material = require('./Material');
const AdGroup = require('./AdGroup');
const AdGroupMaterial = require('./AdGroupMaterial');
const PlayLog = require('./PlayLog');
const Tracking = require('./Tracking');
const Favorite = require('./Favorite');
const Comment = require('./Comment');

// 定义模型之间的关系
// User-Material (one-to-many)
User.hasMany(Material, { foreignKey: 'user_id' });
Material.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Material-AdGroup (many-to-many)
Material.belongsToMany(AdGroup, { through: AdGroupMaterial, foreignKey: 'material_id' });
AdGroup.belongsToMany(Material, { through: AdGroupMaterial, foreignKey: 'ad_group_id', as: 'Materials' });

// User-AdGroup (one-to-many)
User.hasMany(AdGroup, { foreignKey: 'user_id' });
AdGroup.belongsTo(User, { foreignKey: 'user_id' });

// Favorite: User-Material (many-to-many)
User.belongsToMany(Material, { through: Favorite, as: 'FavoritedMaterials', foreignKey: 'userId' });
Material.belongsToMany(User, { through: Favorite, as: 'FavoritingUsers', foreignKey: 'materialId' });

// Comment: User-Material (one-to-many, a user can have many comments on a material)
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Material.hasMany(Comment, { foreignKey: 'materialId' });
Comment.belongsTo(Material, { foreignKey: 'materialId' });

// Comment self-association for replies
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parentId', useJunctionTable: false });
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parentId' });

// 初始化数据库
const initDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
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
  Comment
}; 