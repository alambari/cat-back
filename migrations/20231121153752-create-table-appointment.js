'use strict';

/** @type {import('sequelize-cli').Migration} */

const tableName = 'Appointments';

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
        allowNull: false,
      },
      PetOwnerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      DoctorId: {
        type: Sequelize.INTEGER,
      },
      service: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
      },
      visitAt: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      visitTime: {
        type: Sequelize.TIME,
        allowNull: false
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
        queryInterface.addIndex(tableName, ['PetId', 'DoctorId', 'service']),
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
      queryInterface.removeIndex(tableName, ['PetId', 'DoctorId', 'service']),
    ]).then(() => {
      queryInterface.dropTable(tableName);
    });
  }
};
