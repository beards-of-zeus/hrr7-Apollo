angular.module('app.landingPage',[])

.controller('landingPageController', function ($scope, $http, auth, store, $state) {
  $scope.login = function () {
    auth.signin({}, function (profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      $state.go('game');
    }, function () {
      // Error callback
    });
  };
});