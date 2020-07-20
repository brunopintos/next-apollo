import fs from "fs";
import path from "path";
import Sequelize from "sequelize";

const config = require(__dirname + "/../config/config.json")[
  process.env.NODE_ENV
];
const sequelize = new Sequelize(
  `postgres://${config.username}:${config.password}@postgres:5432/${config.database}`
);
const dataBase = {};
const route = `${process.cwd()}/pages/api/models`;

fs.readdirSync(route)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(route, file));
    dataBase[model.name] = model;
  });

Object.keys(dataBase).forEach(modelName => {
  if (dataBase[modelName].associate) {
    dataBase[modelName].associate(dataBase);
  }
});

dataBase.sequelize = sequelize;
dataBase.Sequelize = Sequelize;
dataBase.sequelize.sync();

export default dataBase;
