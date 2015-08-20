angular.module('app', ['ui.router', 'app.game', 'app.leaderboard', 'app.setInitials', 'ui.codemirror'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  var landingPage = {
    name: 'landingPage',
    url: '/',
    templateUrl: './landingPage/landingPage.html'
  };

  var game = {
    name: 'game',
    url: '/game',
    templateUrl: './game/game.html'
  };

  var leaderboard = {
    name: 'leaderboard',
    url: '/leaderboard',
    templateUrl: './leaderboard/leaderboard.html'
  };

  var setInitials = {
    name: 'setInitials',
    url: '/setInitials',
    templateUrl: './leaderboard/setInitials.html'
  };

  $stateProvider
    .state(landingPage)
    .state(game)
    .state(leaderboard)
    .state(setInitials);

}])

.run(['$state', function($state){
  $state.transitionTo('game');
}]);


