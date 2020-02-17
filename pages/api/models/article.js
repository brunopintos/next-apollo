"use-strict";

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [8, 100]
        }
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 20]
        }
      },
      content: {
        type: DataTypes.STRING
      },
      parentId: {
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
      isFavourite: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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

  Article.associate = function(models) {
    Article.belongsTo(models.Article, { foreignKey: "parentId", as: "parent" });
    Article.hasMany(models.Article, {
      foreignKey: "parentId",
      as: "articles"
    });
    Article.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
    Article.belongsToMany(models.Tag, {
      through: "ArticleTag",
      foreignKey: "articleId"
    });
    Article.hasMany(models.Modification, {
      foreignKey: "articleId",
      as: "modifications"
    });
  };

  return Article;
};
