"use strict";

module.exports = function (sequelize, DataTypes) {
  const Doctor = sequelize.define('Doctor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    specialist: {
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
  });

  Doctor.associate = (db) => {
    Doctor.hasMany(db.Appointment, {constraints: false});
		Doctor.hasMany(db.MedicalRecord, {constraints: false});
  };

  return Doctor;
};
