"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable(
          "users",
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            username: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
              validate: {
                len: [8, 100]
              }
            },
            email: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
              validate: {
                isEmail: true,
                len: [2, 320]
              }
            },
            password: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: {
                len: [8, 100]
              }
            },
            createdAt: {
              type: Sequelize.DATE
            },
            updatedAt: {
              type: Sequelize.DATE
            }
          },
          { transaction: t }
        ),
        queryInterface.createTable(
          "articles",
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            title: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
              validate: {
                len: [8, 100]
              }
            },
            icon: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: {
                len: [1, 20]
              }
            },
            tags: {
              type: Sequelize.ARRAY(Sequelize.STRING)
            },
            isFavourite: {
              type: Sequelize.BOOLEAN,
              allowNull: false
            },
            ownerId: {
              type: Sequelize.INTEGER,
              references: {
                model: {
                  tableName: "users"
                },
                key: "id"
              }
            },
            createdAt: {
              type: Sequelize.DATE
            },
            updatedAt: {
              type: Sequelize.DATE
            }
          },
          { transaction: t }
        ),
        queryInterface.createTable(
          "contents",
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            data: {
              type: Sequelize.STRING,
              allowNull: false
            },
            articleId: {
              type: Sequelize.INTEGER,
              references: {
                model: {
                  tableName: "articles"
                },
                key: "id"
              }
            },
            createdAt: {
              type: Sequelize.DATE
            },
            updatedAt: {
              type: Sequelize.DATE
            }
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable("users", { transaction: t }),
        queryInterface.dropTable("articles", { transaction: t }),
        queryInterface.dropTable("contents", { transaction: t })
      ]);
    });
  }
};
