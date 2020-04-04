const Sequelize = require('sequelize');
const dbconfig = require('../config/database');

const File = require('../models/File');
const User = require('../models/User');

const sequelize = new Sequelize(dbconfig);

File.init(sequelize);
User.init(sequelize);

module.exports = sequelize;