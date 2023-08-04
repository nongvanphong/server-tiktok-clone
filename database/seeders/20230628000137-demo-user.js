"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    return queryInterface.bulkInsert("users", [
      {
        firstName: "John",
        lastName: "Doe",
        email: "example@example.com",
        password: hashedPassword,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "phong",
        lastName: "phong",
        email: "phong@example.com",
        password: hashedPassword,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "hanh",
        lastName: "to",
        email: "hanh@example.com",
        password: hashedPassword,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "tuâns",
        lastName: "to",
        email: "hanh@example.com",
        password: hashedPassword,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "đức",
        lastName: "trường",
        email: "trường@example.com",
        password: hashedPassword,
        status: 0,
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
    return queryInterface.bulkDelete("users", null, {});
  },
};
