'use strict';

const moment = require('moment');
const { generateToken } = require(`${__base}lib/utils`);
const { Op } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  const AccessToken = sequelize.define('AccessToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true
  });

  AccessToken.associate = function (db) {
    AccessToken.belongsTo(db.User);
  };

  AccessToken.findCreateOrUpdateToken = (user) => {
    return AccessToken.findOne({
      where: {
        UserId: user.id,
				expiredAt: { 
          [Op.gte]: moment().add(5, 'minutes')
        },
      }
    }).then(token => {
      if(!token) {
        return AccessToken.create({
          UserId: user.id,
          token: generateToken(256),
          expiredAt: moment().add(24, 'hours').toISOString()
        });
      }

      return token.update({
        expiredAt: moment(token.expiredAt).add(24, 'hours').toISOString()
      });
    });
  };

	AccessToken.prototype.isExpired = function () {
		return moment(this.expiredAt).isBefore();
	};
  
	AccessToken.prototype.expiresIn = function () {
		return moment(this.expiredAt).diff(moment(), 'seconds');
	};

  return AccessToken;
};