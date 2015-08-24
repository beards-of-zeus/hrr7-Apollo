angular.module('app.user', [])
  .controller('userController', function($location, $scope, $http){
    $scope.user = {gender: 'female'};
    $scope.backToGame = function() {
      $location.path('/game');
    };
  });
