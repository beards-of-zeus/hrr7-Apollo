// Karma configuration
// Generated on Tue Aug 11 2015 08:34:44 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      //3rd Party
      '../client/bower_components/angular/angular.js',
      '../client/bower_components/angular-ui-router/release/angular-ui-router.js',
      '../client/bower_components/angular-ui-codemirror/ui-codemirror.js',
      '../client/bower_components/angular-mocks/angular-mocks.js',
      '../client/bower_components/auth0.js/build/auth0.js',
      '../client/bower_components/auth0-lock/build/auth0-lock.js',
      '../client/bower_components/auth0-angular/build/auth0-angular.js',
      '../client/bower_components/a0-angular-storage/dist/angular-storage.js',
      '../client/bower_components/angular-jwt/dist/angular-jwt.js',
      '../client/bower_components/angulartics/dist/angulartics.min.js',
      '../client/bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',

      //App
      '../client/app.js',
      '../client/landingpage/*.js',
      '../client/game/*.js',
      '../client/leaderboard/*.js',
      //'../client/user/*.js',

      //Tests
      '../tests/unit/*.js',
      '../tests/midway/*.js',
      '../tests/e2e/*.js'
    ],  


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
