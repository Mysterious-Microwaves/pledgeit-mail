module.exports = function(grunt) {

  grunt.initConfig({

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**.js', 'test/**/*.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('test', ['mochaTest']);
};
