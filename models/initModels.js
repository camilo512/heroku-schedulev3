const { Repair } = require('./reparir.model');
const { User } = require('./user.model');
const { Comment } = require('./comment.model');
const { RepairImg } = require('./reapairImgs.model');

const initModels = () => {
  // 1 User <---> M Post
  // User.hasMany(Post, { foreignKey: 'userId' });

  User.hasMany(Repair);
  Repair.belongsTo(User);

  // 1 User <---> M Comment

  User.hasMany(Comment);
  Comment.belongsTo(User);

  // 1 Repair <---> M Comment

  Repair.hasMany(Comment);
  Comment.belongsTo(Repair);

  // 1 Repair <---> M RepairImg
  Repair.hasMany(RepairImg);
  RepairImg.belongsTo(Repair);
};

module.exports = { initModels };
