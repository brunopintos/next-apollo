"use-strict";

module.exports = (sequelize, DataTypes) => {
  const Modification = sequelize.define(
    "Modification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      previousContent: {
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

  Modification.associate = function(models) {
    Modification.belongsTo(models.Article, {
      foreignKey: "articleId",
      as: "article"
    });
    Modification.belongsTo(models.User, {
      foreignKey: "authorId",
      as: "author"
    });
  };

  return Modification;
};
