"use-strict";

module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define(
    "Tags",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 30]
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

  Tags.associate = function(models) {
    Tags.belongsToMany(models.Articles, {
      through: "ArticleTags",
      foreignKey: "tagId"
    });
  };

  return Tags;
};
