const Sequelize = require('sequelize');

const sequelize = new Sequelize('test', 'test', 'test1234', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
