import fs from 'fs';
import path from 'path';
import Sequelize, { ConnectionRefusedError } from 'sequelize';
import config from '../lib/config/index.js';
import { fileURLToPath } from 'url';
import InitRequest from './InitRequest.js';
import ConfirmRequest from './ConfirmRequest.js';
import SelectRequest from './SelectRequest.js';

const dbConfig = config.get('database');
// const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);
// // const basename = path.basename(__filename);
const db = {};

// console.log(dbConfig);



const sequelize = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: dbConfig.pool,
  timezone: '+05:30',
  charset: 'utf8',
  collate: 'utf8_general_ci',
  logging: true,
});

const models ={InitRequest, ConfirmRequest, SelectRequest}
// .forEach(models => {
//     var model = sequelize(models);
//     db[model.name] = model;
//   });

// fs.readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });


  Object.values(models).forEach(Model => {
    const model = Model(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
  

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

Object.values(models).forEach(Model => {
  if (Model.associate) {
    Model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


export default db;
