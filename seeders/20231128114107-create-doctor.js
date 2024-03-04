'use strict';
const { faker } = require('@faker-js/faker/locale/id_ID');
const moment = require('moment');

const Doctors = [...Array(50)].map(() => ({
  name: faker.person.fullName(),
  gender: faker.person.sex(),
  birthday: moment(faker.date.birthdate({ min: 18, max: 65 })).format('YYYY-MM-DD'),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  address: faker.location.streetAddress({ useFullAddress: true }),
  specialist: 'DAiCVIM',
  createdAt: new Date(),
  updatedAt: new Date()  
}));

/** @type {import-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Doctors', Doctors, {});
  },

  async down (queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Doctors', Doctors, {});
  }
};
