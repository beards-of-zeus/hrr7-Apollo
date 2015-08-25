angular.module('app.game', [])
  .controller('gameController', function($state, auth, $scope, $timeout, $interval, $http, scoreFactory, sessionFactory, levelFactory, $analytics){
    //////////
    // Profile
    //////////

    //Create default profile data for new users
    var newProfile = {
      username: auth.profile.given_name,
      highScores: [],
      challengingChars: null,
      highestLevel: 0,
      user_Id: auth.profile.user_id.split('|')[1]
    };

    $scope.getProfile = function(){
    //Get user profile and set it to a local value
      $http.post('/api/getProfile', { id: auth.profile.user_id.split('|')[1] })
        .then(function(res){
          if(!!res.data){
            $scope.userStats = res.data;
          } else {
            $scope.userStats = newProfile;
          }
        });
    };
    
    //Retrieve profile so that it can be updated
    $scope.getProfile();

    $scope.updateProfile = function(){
      //Update stats from this game
      $scope.userStats.highScores.push($scope.totalScore.totalScore);
      $scope.userStats.challengingChars = $scope.missedChars;
      $scope.userStats.highestLevel = Math.max($scope.userStats.highestLevel, $scope.level);
          
      //Send request to update User database
      $http.post('/api/updateUser', $scope.userStats)
        .then(function(res){}, function(err){
          console.err('Error!', err);
        });
    };

    $scope.profile = function() {
      $state.go('user');
    };

    $scope.performance = function(){
      $state.go('performance');
    };

    //////////
    // SET UP
    //////////
    // code editor settings
    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        tabSize: 2,
        autofocus: true
    };
    // links factory score and level variables with their scope versions that are shown in the DOM
    $scope.totalScore = scoreFactory;
    $scope.totalLevel = levelFactory;
    // requests a new session id from the database
    sessionFactory.getSession();

    // helper methods
    var setNewBatch = function(resultsObject){
      $scope.level = 0;
      $scope.challengeFixtures = resultsObject.data[0].batch;
    };
    var startNewLevel = function(){
      $scope.challenge = $scope.challengeFixtures[$scope.level].content;
      $scope.timeLimit = $scope.challengeFixtures[$scope.level].timeLimit;
      levelFactory.totalLevel++;
    };

    // gets the challenge content from the server for the first batch
    // and saves the content in the first level to scope variables that the DOM can access
    $http.get('/api/challengeBatch/0')
    .then(function(res){
      $scope.batch = 0;
      setNewBatch(res);
      startNewLevel();
    });

    // timer setup
    var stop;
    var startTimer = function(timeLimit){
      stop = $interval(function(){
        $scope.timeLimit--;
        // if the timer runs out before a successful submit, the player loses
        if ($scope.timeLimit === 0){
          $analytics.eventTrack('Failed', { category: 'Level', label: $scope.level + ' failed.'});
          $scope.editorOptions = {readOnly: "nocursor"};
          $interval.cancel(stop);
          $scope.gameOver = true;
          $timeout(function(){
            scoreFactory.checkScore($scope.totalScore);
          }, 2500);
          $scope.updateProfile(); 
        }
      }, 1000);
    };
    // start the timer for the first challenge
    startTimer();


    //////////////////////////
    // PLAYER SOLUTION CHECKS
    //////////////////////////
    $scope.missedChars = {};

    $scope.checkChar = function(playerSolution){
      if(playerSolution.length > 0){
        if(playerSolution === $scope.challenge){
          $scope.endLevel(playerSolution);
        } else if (playerSolution[playerSolution.length-1] === $scope.challenge[playerSolution.length-1]){
          //the just typed letter is equal to that in same index of the solution
          if($scope.incorrectBool){//a past value was wrong
            //change to true if values were fixed
            if(playerSolution[$scope.incorrectIndex] === $scope.challenge[$scope.incorrectIndex]){
              $scope.incorrectBool = false;
              $scope.showMessage = false;
            }
          }
        } else {
          // track that there is an error in the solution and where it is in the code
          $scope.incorrectBool = true;
          $scope.incorrectIndex = playerSolution.length-1;

          //Submit missed character to analytics
          $analytics.eventTrack('Missed', { category: 'Characters', label: $scope.challenge[$scope.incorrectIndex]});
          
          //Check if incorrect value is already being tracked
          if ( $scope.missedChars[$scope.challenge[$scope.incorrectIndex]] !== undefined){
            //If so, increment it
            $scope.missedChars[$scope.challenge[$scope.incorrectIndex]]++;
          } else {
            //otherwise declare it
            $scope.missedChars[$scope.challenge[$scope.incorrectIndex]] = 0;
          }
          // show 'incorrect' message
          $scope.submitMessage = 'You typed an incorrect letter!';
          $scope.showMessage = true;
        }
      } else {

      }
    };

    $scope.endLevel = function(playerSolution){
      // stops timer
      $interval.cancel(stop);
      stop = undefined;
      // shows 'correct' message
      $scope.submitMessage = 'You are amazing!';
      $scope.showMessage = true;
      
      // Log passed level
      $analytics.eventTrack('Passed', { category: 'Level', label: $scope.level + ' passed with ' + $scope.timeLimit + ' remaining.'});

      // increase user's level
      $scope.level++;
      // get user's score for this level and add it to total score
      $scope.score = $scope.timeLimit;
      $http.post('/api/sessions', {
        session: sessionFactory.sessionId,
        score: $scope.score
      }).then(function(res){
        // set the factory score variable to the score returned
        scoreFactory.totalScore = res.data;
      });
      // after a pause
      $timeout(function(){
        // reset win message and code editor
        $scope.showMessage = false;
        $scope.playerSolution = "";
        // set up next challenge
        $scope.setNextChallenge();
      }, 1500);
    };

    $scope.setNextChallenge = function(){
      // if there are more challenges in challengeFixtures
      if ( $scope.challengeFixtures[$scope.level] !== undefined ){
        // set up the next challenge
        startNewLevel();
        startTimer();
      // if that was the last challenge in challengeFixtures
      } else {
        // get next batch from server
        $scope.batch++;
        $http.get('/api/challengeBatch/' + $scope.batch)
        .then(function(res){
          // if we received a new batch from the database
          if (res.data.length){
            // set up the next batch + challenge
            setNewBatch(res);
            startNewLevel();
            startTimer();
          // if there are no more challenge batches
          } else {
            // tell the user they won the game and check if the score is high enough for the leader board
            $analytics.eventTrack('Won', {category: 'Game' });
            $scope.gameWon = true;
            $scope.editorOptions = {readOnly: "nocursor"};
            $timeout(function(){
              scoreFactory.checkScore($scope.totalScore);
            }, 2500);
            $scope.updateProfile(); 
          }
        });
      }
    };
  })


  /////////////
  // FACTORIES
  /////////////
  .factory('scoreFactory', function($http, $state){
    var obj = {};

    obj.totalScore = 0;

    // checks to see if the score is high enough for the leaderboard
    obj.checkScore = function(playerScore) {
      $http.get('/api/minHighscore')
        .then(function(res){
          var minHighscore = res.data;
          if (playerScore.totalScore < minHighscore) {
            $state.transitionTo('leaderboard');
          } else {
            $state.transitionTo('setInitials');
          }
        });
    };

    return obj;
  })
  .factory('sessionFactory', function($http){
    var obj = {};

    obj.sessionId;

    obj.getSession = function(){
      $http.post('/api/sessions')
      .then(function(res){
        obj.sessionId = res.data.session;
      });
    };

    return obj;
  })
  .factory('levelFactory', function(){
    var obj = {};

    obj.totalLevel = -1;

    return obj;
  });
