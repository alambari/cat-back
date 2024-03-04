'use strict';

const { 
  extend 
} = require('lodash');

const fs        = require('fs-extra');
const path      = require('path');
const basename  = path.basename(module.filename);
const Sequelize = require('sequelize');
const db        = {};
const conf      = require('../../config/database.json');

const env       = process.env.NODE_ENV || 'development';

const config    = conf[env];

config.logging = function sequelizeLog (queryString) {
  const [sql] = queryString.split(';');
  return console.log(sql);
};

if(env == 'test') {
  Object.assign(config, { logging: false });
}

let sequelize;
if(config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value); };

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const sequelizeInstance = extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);

module.exports = sequelizeInstance;