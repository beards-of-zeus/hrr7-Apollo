angular.module('app.user', [])
  .controller('userController', function($location, $scope, $http, auth){
    $scope.user = auth.profile;

    $scope.backToGame = function() {
      $location.path('/game');
    };

    $scope.createProfile = function(){
      //Build profile object
      $scope.user.username = auth.profile.nickname;
      $scope.user.user_Id = auth.profile.user_id.split('|')[1];
      $scope.user.highScores = [];
      
      //Send request to create new column in User database
      $http.post('/api/createUser', $scope.user)
        .then(function(res){
          $location.path('/game');
        }, function(err){
          console.log('Error!', err);
          $location.path('/landingPage');
        });
    };
  });
