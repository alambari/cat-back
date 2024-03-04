'use strict';

module.exports = function (sequelize, DataTypes) {
  const Resume = sequelize.define('Resume', {
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
    complaint: {
      type: DataTypes.STRING,
    },
    physical: {
      type: DataTypes.STRING,
    },
    diagnose: {
      type: DataTypes.STRING,
    },
    prognose: {
      type: DataTypes.STRING,
    },
    treatment: {
      type: DataTypes.STRING,
    },
    common: {
      type: DataTypes.JSON,
    },
    anamnesis: {
      type: DataTypes.JSON,
    },
    additional: {
      type: DataTypes.JSON,
    },
    notes: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true
  });

  Resume.associate = (db) => {
		Resume.belongsTo(db.Appointment, {constraints: false});
		Resume.belongsTo(db.Pet, {constraints: false});
  };
  

  return Resume;
};