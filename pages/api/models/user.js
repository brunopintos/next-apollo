import dataBase from "./index";
import Article from "./article";

const User = dataBase.sequelize.define(
  "user",
  {
    id: {
      type: dataBase.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [8, 100]
      }
    },
    email: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [2, 320]
      }
    },
    password: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [8, 100]
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

User.hasMany(Article);

export default User;
