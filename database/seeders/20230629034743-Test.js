"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("tests", [
      {
        nameProduct: "áo",
        piceProduct: 1000,
        typeProduct: "trang phục",
        describe: "áo mua dông ấm áp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameProduct: "quần",
        piceProduct: 1090,
        typeProduct: "trang phục",
        describe: "áo mua dông ấm áp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameProduct: "giày",
        piceProduct: 1800,
        typeProduct: "trang phục",
        describe: "áo mua dông ấm áp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("tests", null, {});
  },
};
