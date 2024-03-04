'use strict';

/** @type {import('sequelize-cli').Migration} */

const tableName = 'Pets';

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
      PetOwnerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING,
      },
      species: {
        type: Sequelize.STRING,
      },
      breed: {
        type: Sequelize.STRING,
      },
      additional: {
        type: Sequelize.JSON,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
        queryInterface.addIndex(tableName, ['PetOwnerId']),
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
      queryInterface.removeIndex(tableName, ['PetOwnerId']),
    ]).then(() => {
      queryInterface.dropTable(tableName);
    });
  }
};
