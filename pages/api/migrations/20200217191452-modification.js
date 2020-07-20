"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Modifications", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      newContent: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      previousContent: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      articleId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Articles"
          },
          key: "id"
        }
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users"
          },
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Modifications");
  }
};
