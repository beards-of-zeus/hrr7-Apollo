//Require db
var db = require('./db.js');
var Sequelize = require('sequelize');

//Create User model
var User = db.define('User', {
  username: Sequelize.STRING,
  highScore: Sequelize.INTEGER,
  challengingChars: Sequelize.ARRAY(Sequelize.TEXT),
  avgSpeed: Sequelize.INTEGER,
  highestLevel: Sequelize.INTEGER
});

//Sync model
db.sync().then(function(){
  return User.create({
    username: 'Apollo',
    highScore: 10000,
    challengingChars: ["none"],
    avgSpeed: 120,
    highestLevel: 1000
  });
});

//Export model
module.exports = User;
