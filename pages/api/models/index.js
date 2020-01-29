import Sequelize from "sequelize";

const sequelize = new Sequelize("kbdb", "admin", "admin", {
  host: "postgres",
  dialect: "postgres"
});

const dataBase = {};

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

dataBase.sequelize = sequelize;
dataBase.Sequelize = Sequelize;

export default dataBase;
