'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {

    const petOwners = await queryInterface.select(null, 'PetOwners');

    if(petOwners) {
      const id = petOwners.map(item => item.id);

      const Pets = [...Array(150)].map(() => ({
        name: faker.animal.cat(),
        gender: faker.person.sex(),
        species: 'cat',
        breed: faker.animal.cat(),
        PetOwnerId: id[Math.floor(Math.random() * id.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      return queryInterface.bulkInsert('Pets', Pets, {});
    }

    
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Pets', [], {});
  }
};
