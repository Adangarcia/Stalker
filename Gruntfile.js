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
          yuicompress: true
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
          '.tmp/stalker.concat.js': [
            '.tmp/**/*.js',
            '!.tmp/templates.js'
          ]
        }
      },
      vendor: {
        files: {
          '.tmp/vendor.js': [
            'client/vendor/jquery/jquery.js',
            'client/vendor/handlebars/handlebars.js',
            'client/vendor/ember/ember.js',
            'client/vendor/ember-data/ember-data.js',
            'client/vendor/ember-loader/loader.js'
          ]
        }
      }
    },

    // Copy over .tmp files for development rather than uglifying
    copy: {
      development: {
        expand: true,
        cwd: '.tmp/',
        src: ['stalker.js', 'vendor.js', 'templates.js'],
        dest: 'public/assets/'
      }
    },

    // Uglify javascript source
    uglify: {
      production: {
        src: ['.tmp/stalker.js', '.tmp/vendor.js', '.tmp/templates.js'],
        dest: 'public/assets'
      }
    },

    // Compile ES6 to ES5
    transpile: {
      stalker: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'client/',
          src: ['**/*.js', '!vendor/**'],
          dest: '.tmp/'
        }]
      }
    },

    browser: {
      stalker: {
        options: {
          barename: 'application',
          namespace: 'Stalker'
        },
        src: '.tmp/stalker.concat.js',
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

  // Task from: http://www.thomasboyt.com/2013/06/21/es6-module-transpiler
  grunt.registerMultiTask('browser', "Export a module to the window", function() {
    var opts = this.options();
    this.files.forEach(function(f) {
      var output = ["(function(globals) {"];

      output.push.apply(output, f.src.map(grunt.file.read));

      output.push(grunt.template.process(
        'window.<%= namespace %> = requireModule("<%= barename %>");', {
        data: {
          namespace: opts.namespace,
          barename: opts.barename
        }
      }));
      output.push('})(window);');

      grunt.file.write(f.dest, grunt.template.process(output.join("\n")));
    });
  });

  // Task definitions
  grunt.registerTask('production', ['build', 'less:production', 'ugilify', 'clean:tmp']);
  grunt.registerTask('development', ['build', 'less:development', 'copy']);
  grunt.registerTask('build', ['jshint', 'clean', 'emberTemplates', 'transpile', 'concat', 'browser']);

  grunt.registerTask('default', ['development']);

};
