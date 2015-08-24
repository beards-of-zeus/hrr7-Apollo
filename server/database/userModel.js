//Require db
var db = require('./db.js');
var Sequelize = require('sequelize');

//Create User model
var User = db.define('User', {
  username: Sequelize.STRING,
  highScores: Sequelize.ARRAY(Sequelize.INTEGER),
  challengingChars: Sequelize.JSON,
  highestLevel: Sequelize.INTEGER,
  age: Sequelize.STRING,
  gender: Sequelize.STRING,
  user_Id: {type: Sequelize.STRING,
      unique: true, 
      notEmpty: true, 
      notNull: true,
      primaryKey: true
    }
});

//Sync model
db.sync();

//Export model
module.exports = User;