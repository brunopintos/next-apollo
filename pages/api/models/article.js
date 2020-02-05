import dataBase from "./index";
import User from "./user";
import Content from "./content";

const Article = dataBase.sequelize.define(
  "article",
  {
    id: {
      type: dataBase.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [8, 100]
      }
    },
    icon: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    tags: {
      type: dataBase.Sequelize.ARRAY(dataBase.Sequelize.STRING)
    },
    isFavourite: {
      type: dataBase.Sequelize.BOOLEAN,
      allowNull: false
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

Article.belongsTo(Article, { as: "parent" });
Article.belongsTo(User, { as: "owner" });
Article.hasOne(Content, { as: "article" });

export default Article;
