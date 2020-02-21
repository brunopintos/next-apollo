"use-strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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

  User.associate = function(models) {
    User.hasMany(models.Article, { foreignKey: "authorId", as: "articles" });
    User.hasMany(models.Modification, {
      foreignKey: "authorId",
      as: "modifications"
    });
  };

  return User;
};
