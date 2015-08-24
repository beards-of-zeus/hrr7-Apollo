angular.module('app', ['auth0','angular-storage','angular-jwt','ui.router', 'app.game', 'app.leaderboard', 'app.setInitials', 'ui.codemirror','app.landingPage', 'angulartics','angulartics.google.analytics', 'app.user', 'app.performance'])

//remove # from address bar on view changes
.config(function($locationProvider){
  $locationProvider.html5Mode(true);
})
//connect to Auth0 account
.config(function (authProvider) {
  authProvider.init({
    domain: 'hfoster.auth0.com',
    clientID: 'lVodlxrgISRTmAjMAWTjp3ov7Kfb3d32',
    loginState: 'landingPage',
  });
})

.run(function(auth) {
  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();
})

//Configure secure calls to the API by returning on each request 
//the JWT token received on the login.
//Adds jwtInterceptor to the list of $http interceptor
.config(function (authProvider, $httpProvider, jwtInterceptorProvider) {

  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
  // ...
})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  var landingPage = {
    name: 'landingPage',
    url: '/landingPage',
    templateUrl: './landingPage/landingPage.html'
  };

  var game = {
    name: 'game',
    url: '/',
    templateUrl: './game/game.html',
    data: { requiresLogin: true }
  };

  var leaderboard = {
    name: 'leaderboard',
    url: '/leaderboard',
    templateUrl: './leaderboard/leaderboard.html'
  };

  var user = {
    name: 'user',
    url: '/user',
    templateUrl: './profile/user.html'
  };

  var performance = {
    name: 'performance',
    url: '/performance',
    templateUrl: './profile/performance.html'
  };
  var setInitials = {
    name: 'setInitials',
    url: '/setInitials',
    templateUrl: './leaderboard/setInitials.html',
    data: { requiresLogin: true }
  };

  $stateProvider
    .state(landingPage)
    .state(game)
    .state(leaderboard)
    .state(user)
    .state(performance)
    .state(setInitials);
}])

//Keep the user logged in after a page refresh
.run(function($rootScope, auth, store, jwtHelper, $state) {
  // This events gets triggered on refresh or URL change
  $rootScope.$on('$locationChangeStart', function() {
    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        // Either show the login page or use the refresh token to get a new idToken
        $state.go('game');
      }
    }
  });
});
//Didn't seem necessary
// .run(['$state', function($state){
//   $state.transitionTo('game');
// }]);


