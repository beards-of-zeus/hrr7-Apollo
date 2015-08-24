angular.module('app.setInitials', [])

.controller('setInitialsController', function(store, auth, $scope, $timeout, $interval, $http, scoreFactory, $state, sessionFactory, levelFactory, $analytics){
  // adds the total score to the scope so it can be viewed in the DOM
  $scope.totalScore = scoreFactory;
  $scope.totalLevel = levelFactory;

  // sends the player's score to the database for the leaderboard
  $scope.submitScore = function(playerInitials, playerScore) {
    $analytics.eventTrack('High Score', { category: playerInitials, label: playerScore});
    $http.post('/api/games', {
      session: sessionFactory.sessionId,
      initials: playerInitials,
      score: playerScore
    }).then(function(res){
      $state.transitionTo('leaderboard');
    });
  };

  $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $state.go('landingPage');
    };
});