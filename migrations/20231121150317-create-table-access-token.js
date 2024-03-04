'use strict';

/** @type {import('sequelize-cli').Migration} */

const tableName = 'AccessTokens';

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
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      expiredAt: {
        type: Sequelize.DATE,
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
        queryInterface.addIndex(tableName, ['UserId', 'token', 'expiredAt']),
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
      queryInterface.removeIndex(tableName, ['UserId', 'token', 'expiredAt']),
    ]).then(() => {
      queryInterface.dropTable(tableName);
    });
  }
};
