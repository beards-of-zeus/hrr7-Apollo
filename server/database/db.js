//Require sequelize
var Sequelize = require('sequelize');

//Initiate database and connection
//Use a uri formatted 'mysql://username:pass@host:port/database' for brevity
var sequelize = new Sequelize('postgres://@localhost:5432/delphi');

//Export
module.exports = sequelize;
