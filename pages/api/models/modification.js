"use-strict";

module.exports = (sequelize, DataTypes) => {
  const Modifications = sequelize.define(
    "Modifications",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      newContent: {
        type: DataTypes.TEXT,
        allowNull: false
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
      authorId: {
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

  Modifications.associate = function(models) {
    Modifications.belongsTo(models.Articles, {
      foreignKey: "articleId",
      as: "article"
    });
    Modifications.belongsTo(models.Users, {
      foreignKey: "authorId",
      as: "author"
    });
  };

  return Modifications;
};
