describe('Midway: Controllers', function() {

  beforeEach(module('app'));

  it('should have a landingPageController', function() {
    expect(app.landingPageController).not.to.equal(null);
  });

  it('should have a gameController', function() {
    expect(app.gameController).not.to.equal(null);
  });

  it('should have a leaderboardController', function() {
    expect(app.leaderboardController).not.to.equal(null);
  });

  it('should have a setInitialsController', function() {
    expect(app.setInitialsController).not.to.equal(null);
  });

  xit('should have a userController', function() {
    expect(app.userController).not.to.equal(null);
  });
});