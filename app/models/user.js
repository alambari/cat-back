"use strict";

const bcrypt = require('bcryptjs');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    paranoid: true
  });

  User.associate = (db) => {
    User.hasMany(db.AccessToken);
  };

  User.prototype.passValidate = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
