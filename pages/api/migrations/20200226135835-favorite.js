"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Favorites", {
      articleId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Articles"
          },
          key: "id"
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users"
          },
          key: "id"
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Favorites");
  }
};
