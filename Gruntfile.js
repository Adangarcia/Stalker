module.exports = function(grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    // Lint all js source
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      client: ['client/**/*.js', '!client/vendor/**']
    },

    // Remove build and .tmp directories/files
    clean: {
      tmp: ['.tmp/'],
      build: [
        'public/assets/stalker.css',
        'public/assets/stalker.js',
        'public/assets/vendor.js'
      ]
    },

    // Build less stylesheets
    less: {
      development: {
        files: {
          'public/assets/stalker.css': 'client/styles/stalker.less'
        }
      },
      production: {
        options: {
          compress: true
        },
        files: {
          'public/assets/stalker.css': 'client/styles/stalker.less'
        }
      }
    },

    // Compile ember templates
    emberTemplates: {
      development: {
        options: {
          templateBasePath: /client\/templates\//
        },
        files: {
            '.tmp/templates.js': 'client/templates/**/*.hbs'
        }
      }
    },

    // Concatenate javascript source
    concat: {
      source: {
        files: {
          '.tmp/stalker.js': [
            '.tmp/**/*.js',
            '!.tmp/templates.js'
          ]
        }
      },
      vendor: {
        files: {
          '.tmp/vendor.js': [
            'client/vendor/jquery/dist/jquery.js',
            'client/vendor/handlebars/handlebars.js',
            'client/vendor/ember/ember.js',
            'client/vendor/ember-data/ember-data.js',
            'client/vendor/moment/moment.js',
            'client/vendor/datetimepicker/jquery.datetimepicker.js'
          ]
        }
      }
    },

    // Copy over .tmp files for development rather than uglifying
    copy: {
      development: {
        expand: true,
        cwd: '.tmp/',
        src: [
          'stalker.js',
          'vendor.js',
          'templates.js'
        ],
        dest: 'public/assets/'
      }
    },

    // Uglify javascript source
    uglify: {
      production: {
        files: {
          'public/assets/vendor.js': '.tmp/vendor.js',
          'public/assets/stalker.js': '.tmp/stalker.js',
          'public/assets/templates.js': '.tmp/templates.js'
        }
      }
    },

    // Run includes to build all modules
    includes: {
      stalker: {
        options: {
          includePath: 'client/',
          filenameSuffix: '.js',
          includeRegexp: /(\s*)\/\/\s+import\s+([^$\s]+)/
        },
        src: 'client/application.js',
        dest: '.tmp/stalker.js'
      }
    },

    // Watch task for development
    watch: {
      development: {
        files: 'client/**',
        tasks: ['development']
      }
    }
  });

  // Task definitions
  grunt.registerTask('production', ['build', 'less:production', 'uglify', 'clean:tmp']);
  grunt.registerTask('development', ['build', 'less:development', 'copy', 'clean:tmp']);
  grunt.registerTask('build', ['jshint', 'clean:build', 'emberTemplates', 'includes', 'concat']);

  grunt.registerTask('default', ['development']);

};
