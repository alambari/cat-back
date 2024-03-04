'use strict';

module.exports = function (sequelize, DataTypes) {
  const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PetId: {
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
    paranoid: true
  });

  MedicalRecord.associate = (db) => {
		MedicalRecord.belongsTo(db.Pet, {constraints: false});
		MedicalRecord.belongsTo(db.Doctor, {constraints: false});
  };
  

  return MedicalRecord;
};