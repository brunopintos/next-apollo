import dataBase from "./index";

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
    content: {
      type: dataBase.Sequelize.STRING,
      allowNull: false //usar objetos
    },
    tags: {
      type: dataBase.Sequelize.STRING,
      allowNull: false //usar objetos
    },
    parent: {
      type: dataBase.Sequelize.STRING,
      allowNull: false //usar objetos
    },
    owner: {
      type: dataBase.Sequelize.STRING,
      allowNull: false //usar objetos
    },
    isFavourite: {
      type: dataBase.Sequelize.BOOLEAN,
      allowNull: false //usar objetos
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

export default Article;
