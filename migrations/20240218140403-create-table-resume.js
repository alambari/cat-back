'use strict';

/** @type {import('sequelize-cli').Migration} */

const tableName = 'Resumes';

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
      AppointmentId: {
        type: Sequelize.INTEGER
      },
      PetId: {
        type: Sequelize.INTEGER,
      },
      complaint: {
        type: Sequelize.STRING,
      },
      physical: {
        type: Sequelize.STRING
      },
      diagnose: {
        type: Sequelize.STRING
      },
      prognose: {
        type: Sequelize.STRING
      },
      treatment: {
        type: Sequelize.STRING
      },
      additional: {
        type: Sequelize.JSON,
      },
      common: {
        type: Sequelize.JSON,
      },
      anamnesis: {
        type: Sequelize.JSON,
      },
      notes: {
        type: Sequelize.STRING
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
        queryInterface.addIndex(tableName, ['AppointmentId', 'PetId']),
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
      queryInterface.removeIndex(tableName, ['AppointmentId', 'PetId']),
    ]).then(() => {
      queryInterface.dropTable(tableName);
    });
  }
};
