"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable(
          "Users",
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
              allowNull: false,
              type: Sequelize.DATE
            },
            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE
            }
          },
          { transaction: t }
        ),
        queryInterface.createTable(
          "Articles",
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
            isFavourite: {
              type: Sequelize.BOOLEAN,
              allowNull: false
            },
            parentId: {
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
          },
          { transaction: t }
        ),
        queryInterface.createTable(
          "Tags",
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            name: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
              validate: {
                len: [1, 30]
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
          },
          { transaction: t }
        ),
        queryInterface.createTable(
          "ArticleTags",
          {
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
          },
          { transaction: t }
        )
        // .then(() => {
        //   queryInterface.sequelize.query(
        //     'ALTER TABLE "ArticleTags" ADD CONSTRAINT "articleTagIds" PRIMARY KEY ("articleId", "tagId")'
        //   );
        // })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable("Users", { transaction: t }),
        queryInterface.dropTable("Articles", { transaction: t }),
        queryInterface.dropTable("Tags", { transaction: t }),
        queryInterface.dropTable("ArticleTags", { transaction: t })
      ]);
    });
  }
};
