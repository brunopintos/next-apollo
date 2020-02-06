import dataBase from "./index";
import Article from "./article";

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

Content.belongsTo(Article);

export default Content;
