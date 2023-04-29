const Sequelize = require('sequelize').Sequelize;


const sequelize = new Sequelize('nodejs-mysql', 'root', 'Shubham@803214', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false,
});

module.exports = sequelize;