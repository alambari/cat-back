"use strict";

const Chance = require('chance');

module.exports = function (sequelize, DataTypes) {
  const Pet = sequelize.define('Pet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PetOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    species: {
      type: DataTypes.STRING,
    },
    breed: {
      type: DataTypes.STRING,
    },
    additional: {
      type: DataTypes.JSON,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    paranoid: true,
    hooks: {
			beforeValidate: async (instance) => {
        const petOwner = await instance.getPetOwner();
        const random = new Chance();
				instance.code = `${petOwner.code}${random.integer({ min: 100000, max: 999999 }).toString()}`;
			},
    }
  });
  
  Pet.associate = (db) => {
		Pet.belongsTo(db.PetOwner, {constraints: false});
		Pet.hasMany(db.Appointment, {constraints: false});
		Pet.hasMany(db.MedicalRecord, {constraints: false});
		Pet.hasMany(db.GeneralCheck, {constraints: false});
  };

  return Pet;
};
