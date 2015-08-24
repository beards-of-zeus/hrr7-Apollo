///////////
// SET UP
///////////
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var morgan = require('morgan');                   // log requests to the console (express4)
var bodyParser = require('body-parser');          // pull information from HTML POST (express4)
var methodOverride = require('method-override');  // simulate DELETE and PUT (express4)
var security = require('./server/security/sessionAuthorization.js');
var jwt = require('express-jwt');


///////////
// CONFIG
///////////
// DB_URI enviroment variable contains mongoLab url for production server
DB_URI = process.env.DB_URI || 'mongodb://localhost/apollo';
mongoose.connect(DB_URI);
var db = mongoose.connection;

// Log database connection errors
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongo DB connection is open");
});
module.exports = db;

app.use(express.static(__dirname + '/client/'));                // set the static files location (e.g. /client/game will be /game)
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


///////////
// Auth0; when used in app.get/post requests, prevents access unless user is signed in
///////////
var jwtCheck = jwt({
  secret: new Buffer('5wUfyoKgLEBjcIapm6WwbaW6DLjWHtZv74OIKG2EXeN2LhDTiEFCQuOzzu_Tmhk6', 'base64'),
  audience: 'lVodlxrgISRTmAjMAWTjp3ov7Kfb3d32'
});

///////////
// MODELS
///////////
var Game = require('./server/games/gameModel.js');
var ChallengeBatch = require('./server/challengeBatches/challengeBatchModel.js');
var Session = require('./server/security/sessionModel.js');


///////////
// ROUTES
///////////
// MINIMUM OF THE CURRENT 'HIGH SCORES'
// Used in client to determine if the player's current score qualifies as a 'highscore'
app.get('/api/minHighscore', jwtCheck, function (req, res){
  Game.find({}).sort('-highscore').exec(function (err, games) {
    if (err) {
      console.log('ERROR',err);
      res.send(err);
    }

    // sends back 10th highscore
    // arbitrary # depending on how many you want in Leaderboard
    // (consider extracting to variable for easier refactoring)
    res.json(games[9].highscore);
  });
});

// GAMES
// Create a new instance of Game with user's initials, highscore, and current date
app.post('/api/games', jwtCheck, security.checkSession, function (req, res){
  // find entry in Session collection with session id to get the user's total score
  Session.findOne({_id: req.body.session}).exec(function(err, session){
    // save it to the Games collection for the leaderboard
    var game = new Game();
    game.initials = req.body.initials;
    game.highscore = session.currentScore;
    game.date = new Date();
    game.save(function(err){
      if (err) {
        console.log('ERROR:', err);
        res.send(err);
      }
      res.json(game);
    });
  });
});

// LEADERBOARD
// Retrieves Top 10 Scores
app.get('/api/leaderboard', function (req, res){
  Game.find({}).sort('-highscore').limit(10).exec(function (err, games){
    if(err){
      console.log('ERROR:', err);
      res.send(err);
    }

    res.json(games);
  });
});

// CHALLENGE BATCH
// Retrieves batch of Challenges rather than making requests for individual challenges
app.get('/api/challengeBatch/:id', jwtCheck, function (req, res){
  ChallengeBatch.find({id: req.params.id}).exec(function (err, batch){
    if (err) {
      console.log('ERROR:', err);
      res.send(err);
    }

    console.log('BATCH:', batch);
    res.json(batch);
  });
});

// SESSIONS
app.post('/api/sessions', jwtCheck, function (req, res){
  // if there is no session id and no score sent with the request, insert a new session entry
  if (!req.body.session && !req.body.score){
    var session = new Session();
    session.date = new Date();
    session.level = 0;
    session.currentScore = 0;
    session.save(function(err){
      if (err) {
        console.log('ERROR:', err);
        res.send(err);
      }
      res.json( {session: session._id} );
    });
  // if it's missing either the score or the id, or the score is higher than what the game allows, send back a 'Bad Request' response
  // please note that if the timeLimits of the various challenges are changed to be not all the same,
  // this last check will need to happen after you've gotten the existing entry out of the database so you can see what level the user
  // was last on and check that against the timeLimit of that level's challenge
  } else if (!req.body.session || !req.body.score || req.body.score >= 90){
    res.send(400);
  // else update the score in the collection entry of the id
  } else {
    var query = {
      _id: req.body.session
    };
    // get existing document so we can get the current values and update them
    Session.findOne(query).exec(function(err, session){
      if (err) {
        console.log('ERROR:', err);
        res.end(err);
      }
      var totalScore = session.currentScore + +req.body.score;
      var level = session.level + 1;
      var insert = {
        currentScore: totalScore,
        level: level
      };
      Session.findOneAndUpdate(query, insert, function(err, doc){
        if (err) return res.send(500, { error: err });
        // send the total score back to the client
        return res.json(totalScore);
      });
    });
  }
});

///////////
// PROFILE
///////////
var postDB = require('./server/database/db.js');
var User = require('./server/database/userModel.js');

//Creates a new user in the database
app.post('/api/createUser', function(req, res){
  User.upsert({
    username: req.body.username,
    highScores: req.body.highScores,
    challengingChars: req.body.challengingChars,
    highestLevel: req.body.highestLevel,
    user_Id: req.body.user_Id
  }).then(function(user){
    res.sendStatus(200);
  });
});

//Updates user row
app.post('/api/updateUser', function(req, res){
  User.upsert({
      highScores: req.body.highScores,
      challengingChars: JSON.stringify(req.body.challengingChars),
      highestLevel: req.body.highestLevel,
      user_Id: req.body.user_Id
    })
  .then(function(success){
    res.sendStatus(200);
  });
});

//Retrieves user from database
app.post('/api/getProfile', function(req, res){
  User.find({
    where: {
      user_Id: req.body.id
    }
  }).then(function(profile){
    res.send(profile);
  });
});
///////////


///////////
// LISTEN
///////////
var port = process.env.PORT || 8080;
app.listen(port);
console.log("App listening on port " + port);
