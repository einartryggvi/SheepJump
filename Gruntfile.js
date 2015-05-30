module.exports = function (grunt) {
	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['app/scripts/{,*/}*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			sass: {
				files: ['app/styles/{,*/}*.{scss,sass}'],
				tasks: ['compass']
			},
			styles: {
				files: ['app/styles/{,*/}*.css'],
				tasks: ['newer:copy:styles']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'app/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'app/images/{,*/}*'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function(connect) {
						return [
							connect.static('.tmp'),
							connect().use('/bower_components', connect.static('./bower_components')),
							connect.static('app')
						];
					}
				}
			},
			dist: {
				options: {
					base: 'dist',
					livereload: false
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'dist/*',
						'!dist/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'app/scripts/{,*/}*.js',
				'!app/scripts/vendor/*',
			]
		},

		// Compiles Sass to CSS and generates necessary files if requested
		//sass: {
		//	options: {
		//		loadPath: 'bower_components'
		//	},
		//	dist: {
		//		files: [{
		//			expand: true,
		//			cwd: 'app/styles',
		//			src: ['*.{scss,sass}'],
		//			dest: '.tmp/styles',
		//			ext: '.css'
		//		}]
		//	},
		//	server: {
		//		files: [{
		//			expand: true,
		//			cwd: 'app/styles',
		//			src: ['*.{scss,sass}'],
		//			dest: '.tmp/styles',
		//			ext: '.css'
		//		}]
		//	}
		//},

		// compile .scss/.sass to .css using Compass
		compass: {
			dist: {
				// http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
				options: {
					cssDir: 'dist/styles',
					sassDir: 'app/styles',
					imagesDir: 'app/images',
					javascriptsDir: 'temp/scripts',
					force: true,
					environment: 'production',
					outputStyle: 'compressed',
					noLineComments: true
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					name: 'main',
					mainConfigFile: 'app/scripts/main.js',
					out: 'dist/scripts/app.js'
				}
			}
		},

		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'dist/scripts/{,*/}*.js',
						'dist/styles/{,*/}*.css',
						'dist/images/{,*/}*.*',
						'dist/styles/fonts/{,*/}*.*',
						'dist/*.{ico,png}'
					]
				}
			}
		},

		uglify: {
			build: {
				files: {
					'dist/scripts/vendor.js': [
							'bower_components/modernizr/modernizr.js',
						'bower_components/howler.js/howler.js',
						'bower_components/zepto/zepto.js',
						'bower_components/requirejs/require.js'
					],
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				dest: 'dist'
			},
			html: 'app/index.html'
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: [
					'dist',
					'dist/images',
					'dist/scripts',
					'dist/styles'
				]
			},
			html: ['dist/{,*/}*.html'],
			css: ['dist/styles/{,*/}*.css']
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: 'dist/images'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					removeAttributeQuotes: true,
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true
				},
				files: [{
					expand: true,
					cwd: 'dist',
					src: '{,*/}*.html',
					dest: 'dist'
				}]
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'app',
					dest: 'dist',
					src: [
						'*.{ico,png,txt}',
						'images/{,*/}*.webp',
						'{,*/}*.html',
						'styles/fonts/{,*/}*.*',
						'sounds/*'
					]
				}, {
					src: 'node_modules/apache-server-configs/dist/.htaccess',
					dest: 'dist/.htaccess'
				}, {
					expand: true,
					dot: true,
					cwd: '.',
					src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
					dest: 'dist'
				}]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: 'app/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			server: [
				//'sass:server',
				'compass:dist',
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				//'sass',
				'compass:dist',
				'copy:styles',
				'imagemin'
			]
		}
	});

	grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
		if (grunt.option('allow-remote')) {
			grunt.config.set('connect.options.hostname', '0.0.0.0');
		}
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'requirejs',
		'uglify',
		'concurrent:dist',
		'uglify',
		'copy:dist',
		'rev',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'build'
	]);
};
