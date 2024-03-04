'use strict';

module.exports = function (sequelize, DataTypes) {
  const GeneralCheck = sequelize.define('GeneralCheck', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    AppointmentId: {
      type: DataTypes.INTEGER,
    },
    PetId: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.DECIMAL(5,2),
    },
    height: {
      type: DataTypes.DECIMAL(5,2),
    },
    temperature: {
      type: DataTypes.DECIMAL(5,2),
    },
    steril: {
      type: DataTypes.BOOLEAN,
    },
    age: {
      type: DataTypes.JSON,
    },
    additional: {
      type: DataTypes.JSON,
    },
  }, {
    paranoid: true
  });

  GeneralCheck.associate = (db) => {
		GeneralCheck.belongsTo(db.Appointment, {constraints: false});
		GeneralCheck.belongsTo(db.Pet, {constraints: false});
  };
  

  return GeneralCheck;
};