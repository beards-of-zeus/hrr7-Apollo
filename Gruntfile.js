module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      options: {
        configFile: './tests/karma.conf.js',
        reporters: ['nyan'],
        singleRun: true
      },
      unit: {
        browsers: ['PhantomJS']
      },
    },

    sass: {
      dist: {
        files: {
          'client/styles/style.css': 'client/styles/style.scss'
        }
      }
    },

    watch: {
      css: {
        files: 'client/styles/**/*.scss',
        tasks: ['sass'],
      },
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('style', ['sass', 'watch']);
  grunt.registerTask('test', ['karma']);

};