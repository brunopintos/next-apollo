import dataBase from "./index";
import Article from "./article";

const Tag = dataBase.sequelize.define(
  "tag",
  {
    id: {
      type: dataBase.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 30]
      }
    },
    createdAt: {
      type: dataBase.Sequelize.DATE
    },
    updatedAt: {
      type: dataBase.Sequelize.DATE
    }
  },
  {}
);

Tag.belongsToMany(Article, { through: "articleTags" });

export default Tag;
