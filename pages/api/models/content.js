import dataBase from "./index";

const Content = dataBase.sequelize.define(
  "content",
  {
    id: {
      type: dataBase.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    data: {
      type: dataBase.Sequelize.STRING,
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

export default Content;
