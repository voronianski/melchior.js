module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> (<%= pkg.homepage %>) */\n'
			},

			melchiorjs: {
				files: {
					'src/melchior.min.js': ['src/melchior.js']
				}
			}
		},

		jshint: {
			options: {
				ignores: ['src/melchior.min.js'],
				jshintrc: true
			},

			files: ['*.js']
		},
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['jshint', 'uglify']);
	grunt.registerTask('build', ['default']);
};
