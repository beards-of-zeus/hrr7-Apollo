angular.module('app.landingPage',[]).controller('landingPageController', ['$scope', '$http', 'auth', 'store', '$location',
function ($scope, $http, auth, store, $location) {
  $scope.login = function () {
    auth.signin({}, function (profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      $location.path('/game');
    }, function () {
      // Error callback
    });
  };
}]);