import dataBase from "./index";

const User = dataBase.sequelize.define(
  "user",
  {
    email: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: dataBase.Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  {}
);

export default User;
