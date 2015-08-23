describe('Midway: Modules', function() {
  describe('App Module:', function() {
    var module;
    before(function() {
      module = angular.module('app');
    });

    it('should be registered', function() {
      expect(module).not.to.equal(null);
    });

    describe('Dependencies', function() {
      var dependencies;
      var hasModule = function(m) {
        return dependencies.indexOf(m) >= 0;
      };

      before(function() {
        dependencies = module.value('appName').requires;
      });

      it('should have auth0 as a dependency', function() {
        expect(hasModule('auth0')).to.equal(true);
      });

      it('should have angular-jwt as a dependency', function() {
        expect(hasModule('angular-jwt')).to.equal(true);
      });
      
      it('should have angular-storage as a dependency', function() {
        expect(hasModule('angular-storage')).to.equal(true);
      });
      
      it('should have ui.router as a dependency', function() {
        expect(hasModule('ui.router')).to.equal(true);
      });
      
      it('should have ui.codemirror as a dependency', function() {
        expect(hasModule('ui.codemirror')).to.equal(true);
      });
      
      it('should have app.landingPage as a dependency', function() {
        expect(hasModule('app.landingPage')).to.equal(true);
      });
      
      it('should have app.game as a dependency', function() {
        expect(hasModule('app.game')).to.equal(true);
      });
      
      it('should have app.leaderboard as a dependency', function() {
        expect(hasModule('app.leaderboard')).to.equal(true);
      });
      
      it('should have app.setInitials as a dependency', function() {
        expect(hasModule('app.setInitials')).to.equal(true);
      });
      
      xit('should have app.user as a dependency', function() {
        expect(hasModule('app.user')).to.equal(true);
      });
    });
  });

});