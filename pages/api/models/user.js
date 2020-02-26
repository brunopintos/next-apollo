"use-strict";

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [8, 100]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          len: [2, 320]
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [8, 100]
        }
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["USER", "ADMIN"]
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

  Users.associate = function(models) {
    Users.hasMany(models.Articles, { foreignKey: "authorId", as: "articles" });
    Users.hasMany(models.Modifications, {
      foreignKey: "authorId",
      as: "modifications"
    });
    Users.belongsToMany(models.Articles, {
      through: "Favorites",
      as: "favoriteArticles",
      foreignKey: "userId"
    });
  };

  return Users;
};
