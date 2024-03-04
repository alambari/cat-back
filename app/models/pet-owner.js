'use strict';

const Chance = require('chance');

module.exports = function (sequelize, DataTypes) {
  const PetOwner = sequelize.define('PetOwner', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
    },
    birthplace: {
      type: DataTypes.STRING,
    },
    birthday: {
      type: DataTypes.DATEONLY,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    additional: {
      type: DataTypes.JSON,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    tableName: 'PetOwners',
    paranoid: true,
    hooks: {
      beforeValidate: (instance) => {
        const random = new Chance();
        const code = random.integer({ min: 100000, max: 999999 }).toString();

        instance.code = code;
      }
    }
  });

  PetOwner.associate = (db) => {
		PetOwner.hasMany(db.Pet, { constraints: false });
		PetOwner.hasMany(db.Appointment, {constraints: false});
  };
  
  return PetOwner;
};