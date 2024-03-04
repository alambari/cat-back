'use strict';

/** @type {import('sequelize-cli').Migration} */

const tableName = 'MedicalRecords';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      PetId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      DoctorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      notes: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    }).then(() => {
      return Promise.all([
        queryInterface.addIndex(tableName, ['PetId', 'DoctorId', 'status']),
      ]);
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeIndex(tableName, ['PetId', 'DoctorId', 'status']),
    ]).then(() => {
      queryInterface.dropTable(tableName);
    });
  }
};
