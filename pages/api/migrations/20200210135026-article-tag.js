"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ArticleTags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Articles",
          key: "id"
        }
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Tags",
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
    return queryInterface.dropTable("ArticleTags");
  }
};
