angular.module('app.leaderboard', [])

.controller('leaderboardController', function(store, auth, $scope, $state, $http, scoreFactory, sessionFactory, levelFactory){

  // get scores for leaderboard
  $http.get('/api/leaderboard')
  .then(function(res){
    $scope.scores = res.data;
  });
  
  $scope.startGame = function(){
    // resets the player's score and level in the game view
    scoreFactory.totalScore = 0;
    levelFactory.totalLevel = -1;
    // requests a new session id from the database
    sessionFactory.getSession();
    // redirects back to the game view
    $state.transitionTo('game');
  };

  $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $state.go('landingPage');
    };

  $scope.performance = function(){
      $state.go('performance');
    };
});
