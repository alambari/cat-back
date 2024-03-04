"use strict";

module.exports = function (sequelize, DataTypes) {
  const ClientKey = sequelize.define('ClientKey', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON
    },    
    isActive: {
      type: DataTypes.BOOLEAN
    },
  }, {
    paranoid: true,
  });

  return ClientKey;
};
