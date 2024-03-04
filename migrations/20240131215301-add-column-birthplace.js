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
      queryInterface.addColumn('PetOwners', 'birthplace', { 
        type: Sequelize.STRING 
      }),
      queryInterface.addColumn('Doctors', 'birthplace', { 
        type: Sequelize.STRING 
      })
    ]);
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('PetOwners', 'birthplace'),
      queryInterface.removeColumn('Doctors', 'birthplace')
    ]);
  }
};