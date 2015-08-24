angular.module('app.landingPage',[])

.controller('landingPageController', function ($scope, $http, auth, store, $state) {
  $scope.login = function () {
    auth.signin({}, function (profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      $http.post('/api/getProfile', {id: auth.profile.user_id.split('|')[1]})
        .then(function(res){
          if(!!res.data){
            $state.go('performance');
          } else {
            $state.go('user');
          }
        });
    }, function () {
      // Error callback
    });
  };
});