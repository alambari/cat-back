'use strict';

const tableName = 'ClientKeys';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      secret: {
        type: Sequelize.STRING,
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSON
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
        queryInterface.addIndex(tableName, ['key', 'secret']),
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
      queryInterface.removeIndex(tableName, ['key', 'secret']),
    ]).then(() => {
      queryInterface.dropTable(tableName);
    });
  }
};