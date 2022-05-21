const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

//repairImg
const RepairImg = db.define('repairImg', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  repairImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  repairId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
});

module.exports = { RepairImg };
