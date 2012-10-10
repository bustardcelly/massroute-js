module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'script/**/*.js', 'test/jasmine/**/*.js']
    },
    jshint: {
      options: {
        browser: true,
        smarttabs: true
      }
    },
    jasmine_node: {
      spec: "./test/jasmine/spec",
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    },
    forever: {
      main: 'index.js'
    },
    // not working properly...
    watch: {
      scripts: {
        files: '<config:jasmine_node.spec' + '/*.spec.js',
        tasks: 'jasmine_node'
      }
    }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-forever');

  // Default task.
  grunt.registerTask('default', 'lint jasmine_node forever:restart');
  grunt.registerTask('launch', 'forever:start');
  grunt.registerTask('unlaunch', 'forever:stop');

};