"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Articles", "parentId", {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "Articles"
        },
        key: "id"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Articles", "parentId");
  }
};
