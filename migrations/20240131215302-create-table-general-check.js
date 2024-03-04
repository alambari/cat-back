'use strict';

/** @type {import('sequelize-cli').Migration} */

const tableName = 'GeneralChecks';

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
      weight: {
        type: Sequelize.DECIMAL(5,2),
      },
      height: {
        type: Sequelize.DECIMAL(5,2),
      },
      temperature: {
        type: Sequelize.DECIMAL(5,2),
      },
      steril: {
        type: Sequelize.BOOLEAN,
      },
      age: {
        type: Sequelize.JSON,
      },
      additional: {
        type: Sequelize.JSON,
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
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable(tableName);
  }
};
