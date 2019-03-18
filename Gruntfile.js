// Generated on 2015-06-08 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-include-source');
  grunt.loadNpmTasks('grunt-angular-templates');
  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    buildDate: Date.now()
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    includeSource: {
      options: {
        basePath: 'app',
        //baseUrl: 'public/',
        templates: {
          html: {
            js: '<script src="{filePath}"></script>',
            css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
          }
        }
      },
      myTarget: {
        files: {
          'app/index.html': 'ng1/index.tpl.html',
          'app/index-admin.html': 'ng1/index-admin.tpl.html'
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.ng1 %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.ng1 %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      includeSource: {
        files: [
          '<%= yeoman.ng1 %>/{,*/}index.tpl.html',
          '<%= yeoman.ng1 %>/scripts/{,*/}*.js'
        ],
        tasks: ['includeSource']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.ng1 %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.ng1 %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' or '127.0.0.1' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      // localServer: {
      //   proxies: [
      //     {
      //       context: '/html',
      //       host: 'localhost',
      //       port: 9000,
      //       rewrite: {
      //         '^/html': '/ng1'
      //       }
      //     },
      //     {
      //       context: [
      //         '/',
      //         '!/html',
      //         '!/ng1',
      //         '!/dist',
      //         '!/bower_components'
      //       ],
      //       host: 'localhost',
      //       port: 8080,
      //       https: false,
      //       xforward: false,
      //       headers: {
      //         'is-proxy-mode': true
      //       }
      //     }
      //   ]
      // },
      // devServer: {
      //   proxies: [
      //     {
      //       context: '/html',
      //       host: 'localhost',
      //       port: 9000,
      //       rewrite: {
      //         '^/html': '/ng1'
      //       }
      //     },
      //     {
      //       context: [
      //         '/',
      //         '!/html',
      //         '!/ng1',
      //         '!/dist',
      //         '!/bower_components'
      //       ],
      //       host: 'localhost',
      //       port: 8080,
      //       https: false,
      //       xforward: false,
      //       headers: {
      //         'is-proxy-mode': true
      //       }
      //     }
      //   ]
      // },
      localDevServer: {
        proxies: [
          {
            context: '/html',
            host: 'localhost',
            port: 4200,
            rewrite: {
              '^/html': '/ng1'
            }
          },
          {
            context: [
              '/',
              '!/html',
              '!/ng1',
              '!/dist',
              '!/bower_components'
            ],
            // TO CHANGE PORT 80-81 etc when on serveDev
            host: 'quicktech.com',
            port: 8000,
            https: false,
            xforward: false,
            headers: {
              'is-proxy-mode': true
            }
          }
        ]
      },
      // devDistServer: {
      //   proxies: [
      //     {
      //       context: '/html',
      //       host: 'localhost',
      //       port: 9000,
      //       rewrite: {
      //         '^/html': '/dist'
      //       }
      //     },
      //     {
      //       context: [
      //         '/',
      //         '!/html',
      //         '!/ng1',
      //         '!/dist',
      //         '!/bower_components'
      //       ],
      //       host: '192.168.1.46',
      //       port: 8080,
      //       https: false,
      //       xforward: false,
      //       headers: {
      //         'is-proxy-mode': true
      //       }
      //     }
      //   ]
      // },
      livereload: {
        options: {
          open: true,
          middleware: function (connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            // Setup the proxy
            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

            // Serve static files.
            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.ng1 %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    //{sass,scss} -> css
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.{scss,sass}',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the ng1
    wiredep: {
      app: {
        src: ['<%= yeoman.ng1 %>/index.html'],
        ignorePath: /\.\.\//,
        fileTypes: {
          html: {
            block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
              js: /<script.*src=['"]([^'"]+)/gi,
              css: /<link.*href=['"]([^'"]+)/gi
            },
            replace: {
              js: '<script src="/{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="/{{filePath}}" />'
            }
          }
        }
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.ng1 %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    ngtemplates:  {
      app:        {
        cwd:      'assets/templates',
        src:      '**/partials/*.html',
        dest: 'assets/templates/partials.js',
        options: {
          module: 'cms.admin'
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html', '<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles',
          '<%= yeoman.dist %>/scripts'
        ],
        patterns: {
          html: [
            [
              /[ \t]*<!--\s*build date script\s*-->\s*.*?(dateOfLastBuild).*?\s*<!--\s*end build date script\s*-->/gi,
              'Save build date for cache busting purposes',
              undefined,
              function () {
                return appConfig.buildDate;
              }
            ],
            [
              /<link[^\>]+href=['"]([^"']+)["']/gm, 'Replacing reference to styles',
              undefined,
              function (s) {
                if (s.indexOf('http') !== 0) {
                  s = '/html/' + s;
                }
                return s
              }
            ],
            [
              /<script.+src=['"]([^"']+)["']/gm, 'Replacing reference to scripts',
              undefined,
              function (s) {
                if (s.indexOf('http') !== 0) {
                  s = '/html/' + s;
                }
                return s
              }
            ],
            [
              /<img[^\>]*[^\>\S]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
              'Update the HTML with the new img filenames',
              undefined,
              function (s) {
                if (s.indexOf('http') !== 0) {
                  s = '/html/' + s;
                }
                return s
              }
            ],
            [
              /<video[^\>]+src=['"]([^"']+)["']/gm,
              'Update the HTML with the new video filenames'
            ],
            [
              /<video[^\>]+poster=['"]([^"']+)["']/gm,
              'Update the HTML with the new poster filenames'
            ],
            [
              /<source[^\>]+src=['"]([^"']+)["']/gm,
              'Update the HTML with the new source filenames'
            ],
            [
              /data-main\s*=['"]([^"']+)['"]/gm,
              'Update the HTML with data-main tags',
              function (m) {
                return m.match(/\.js$/) ? m : m + '.js';
              },
              function (m) {
                return m.replace('.js', '');
              }
            ],
            [
              /data-(?!main).[^=]+=['"]([^'"]+)['"]/gm,
              'Update the HTML with data-* tags'
            ],
            [
              /url\(\s*['"]?([^"'\)]+)["']?\s*\)/gm,
              'Update the HTML with background imgs, case there is some inline style'
            ],
            [
              /<a[^\>]+href=['"]([^"']+)["']/gm,
              'Update the HTML with anchors images'
            ],
            [
              /<input[^\>]+src=['"]([^"']+)["']/gm,
              'Update the HTML with reference in input'
            ],
            [
              /<meta[^\>]+content=['"]([^"']+)["']/gm,
              'Update the HTML with the new img filenames in meta tags'
            ],
            [
              /<object[^\>]+data=['"]([^"']+)["']/gm,
              'Update the HTML with the new object filenames'
            ],
            [
              /<image[^\>]*[^\>\S]+xlink:href=['"]([^"'#]+)(#.+)?["']/gm,
              'Update the HTML with the new image filenames for svg xlink:href links'
            ],
            [
              /<image[^\>]*[^\>\S]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
              'Update the HTML with the new image filenames for src links'
            ],
            [
              /<(?:img|source)[^\>]*[^\>\S]+srcset=['"]([^"'\s]+)\s*?(?:\s\d*?[w])?(?:\s\d*?[x])?\s*?["']/gm,
              'Update the HTML with the new image filenames for srcset links'
            ],
            [
              /<(?:use|image)[^\>]*[^\>\S]+xlink:href=['"]([^'"\)#]+)(#.+)?["']/gm,
              'Update the HTML within the <use> tag when referencing an external url with svg sprites as in svg4everybody'
            ]
          ],
          js: [
            [
              /<img[^\>]*[^\>\S]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
              'Update the JS with the new img filenames',
              undefined,
              function (s) {
                if (s.indexOf('http') !== 0) {
                  s = '/html/' + s;
                }
                return s
              }
            ]
          ]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.ng1 %>/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.ng1 %>/images',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html', 'scripts/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.ng1 %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            '!*.tpl.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*',
            'scripts/**/*.html',
            'quicktech/**/*.html',
            'partials/{,*/}*.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.ng1 %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      sass_temp: {
        expand: true,
        cwd: '<%= yeoman.ng1 %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.{scss,sass}'
      },
      temp_sass: {
        expand: true,
        cwd: '.tmp/styles/',
        dest: '<%= yeoman.ng1 %>/styles/',
        src: '{,*/}*.{scss,sass}',
        rename: function (dest, src) {
          return dest + src.replace(/\.(scss|sass)/, '.css');
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('serveLocal', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'includeSource',
      // 'includeSourceAdminPanel',
      'wiredep',
      'configureProxies:localServer',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'includeSource',
      // 'includeSourceAdminPanel',
      'wiredep',
      'configureProxies:devServer',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('serveDev', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'includeSource',
      // 'includeSourceAdminPanel',
      'wiredep',
      'configureProxies:xr',
      'copy:sass_temp',
      'sass:dist',
      'copy:temp_sass',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('serveDist', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'build',
      'configureProxies:devDistServer',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy:sass_temp',
    'sass:dist',
    'copy:temp_sass',
    'clean:server',
    'includeSource',
    // 'includeSourceAdminPanel',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
