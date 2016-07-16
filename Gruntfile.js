/*
 * grunt-srpite
 * https://github.com/dukai/grunt-srpite
 *
 * Copyright (c) 2016 Kyle
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    less: {
      dev: {
        options: {
          paths: ["less"]
        },
        files: [{
          expand: true,
          cwd: 'test/less/',
          src: ['*.less'],
          dest: 'test/css/',
          ext: '.css',
          extDot: 'first' //Extensions in filenames begin after the first dot
        },
        ],
      },
      dest: {
        options: {
          paths: ["less"]
        },
        files: [{
          expand: true,
          cwd: 'test/less-dest/',
          src: ['*.less'],
          dest: 'test/css/',
          ext: '.css',
          extDot: 'first' //Extensions in filenames begin after the first dot
        },
        ],
      },

    },
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    sprite: {
      custom_options: {
        files: [
          {
            expand: true,     //Enable dynamic expansion.
            cwd: 'test/less/',      //Src matches are relative to this path.
            src: ['*.less'], //Actual pattern(s) to match.
            dest: 'test/less-dest/',   //Destination path prefix.
            ext: '.less',   //Dest filepaths will have this extension.
            extDot: 'first'   //Extensions in filenames begin after the first dot
          }
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'sprite']);

  // By default, lint and run all tests.
  grunt.registerTask('dev', ['test', 'less:dev']);
  grunt.registerTask('dest', ['test', 'less:dest']);

};
