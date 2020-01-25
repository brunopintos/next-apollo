import dataBase from "./index";

const User = dataBase.sequelize.define(
  "user",
  {
    email: {
      type: dataBase.Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: dataBase.Sequelize.STRING,
      allowNull: false
    }
  },
  {}
);

export default User;
