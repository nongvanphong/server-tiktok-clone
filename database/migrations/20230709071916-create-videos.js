"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("videos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      userid: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      videotag: {
        type: Sequelize.STRING,
      },
      videotitle: {
        type: Sequelize.STRING,
      },
      videodescrible: {
        type: Sequelize.STRING,
      },
      videouri: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("videos");
  },
};
