describe('Unit: Game Module', function() {
  var scope, ctrl;

  beforeEach(module('app'));
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('gameController', {
      scope : scope
    });
  }));


  //Tests not currently working
  xit('should have totalScore set to 0', function() {
    scope.totalScore.totalScore.should.equal(0);
  });

  xit('should have showMessage set to false',
    function() {
      scope.showMessage.should.equal(false);
  });

  xit('should have gameOver set to false',
    function() {
      scope.gameOver.should.equal(false);
  });
});
