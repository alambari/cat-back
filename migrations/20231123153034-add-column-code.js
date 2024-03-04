'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
      queryInterface.addColumn('PetOwners', 'code', { 
        type: Sequelize.STRING 
      }),
      queryInterface.addColumn('Pets', 'code', { 
        type: Sequelize.STRING 
      })
    ]).then(() => {
      queryInterface.addIndex('PetOwners', ['code']);
      queryInterface.addIndex('Pets', ['code']);
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
      queryInterface.removeIndex('PetOwners', 'code'),
      queryInterface.removeIndex('Pets', 'code')
    ]).then(() => {
      queryInterface.removeColumn('PetOwners', 'code');
      queryInterface.removeColumn('Pets', 'code');
    });

  }
};