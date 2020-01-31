import Sequelize from "sequelize";

const sequelize = new Sequelize("kbdb", "admin", "admin", {
  host: "postgres",
  dialect: "postgres"
});

const dataBase = {};

dataBase.sequelize = sequelize;
dataBase.Sequelize = Sequelize;

export default dataBase;
