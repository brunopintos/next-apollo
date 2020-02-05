"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("articles", "parentId", {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "articles"
        },
        key: "id"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("articles", "parentId");
  }
};
