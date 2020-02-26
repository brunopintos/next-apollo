"use-strict";

module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define(
    "Favorites",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      articleId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Articles"
          },
          key: "id"
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Users"
          },
          key: "id"
        }
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    },
    {}
  );

  return Favorites;
};
