"use-strict";

module.exports = (sequelize, DataTypes) => {
  const Articles = sequelize.define(
    "Articles",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100]
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
        type: DataTypes.TEXT,
        allowNull: false
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
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    },
    {}
  );

  Articles.associate = function(models) {
    Articles.belongsTo(models.Articles, {
      foreignKey: "parentId",
      as: "parent"
    });
    Articles.hasMany(models.Articles, {
      foreignKey: "parentId",
      as: "articles"
    });
    Articles.belongsTo(models.Users, { foreignKey: "authorId", as: "author" });
    Articles.belongsToMany(models.Tags, {
      through: "ArticleTags",
      foreignKey: "articleId"
    });
    Articles.hasMany(models.Modifications, {
      foreignKey: "articleId",
      as: "modifications"
    });
    Articles.belongsToMany(models.Users, {
      through: "Favorites",
      as: "favorites",
      foreignKey: "articleId"
    });
  };

  return Articles;
};
