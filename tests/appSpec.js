describe('GameController', function() {
  // Load the module with gameController
  beforeEach(module('app'));


  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function(_$controller_) {
    // Create a new scope that's a child of the $rootScope
    ctrl = _$controller_;
  }));

  it('should have totalScore set to 0',
    function() {

      scope.totalScore.totalScore.should.equal(0);
  });

  it('should have showMessage set to false',
    function() {
      scope.showMessage.should.equal(false);
  });

  it('should have gameOver set to false',
    function() {
      scope.gameOver.should.equal(false);
  });
});