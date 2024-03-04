'use strict';

module.exports = function (sequelize, DataTypes) {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PetOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DoctorId: {
      type: DataTypes.INTEGER,
    },
    service: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    visitAt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    visitTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true,
  });
  
  Appointment.associate = (db) => {
		Appointment.belongsTo(db.Pet, {constraints: false});
		Appointment.belongsTo(db.PetOwner, {constraints: false});
		Appointment.belongsTo(db.Doctor, {constraints: false});
		Appointment.hasOne(db.GeneralCheck, {constraints: false});
  };

  return Appointment;
};