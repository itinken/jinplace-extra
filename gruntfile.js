
module.exports = function(grunt) {
	var _ = grunt.util._;

	var primary = ['js/checkbox.js', 'js/checkbox_demo.js'];
	var experimental = ['js/forms.js'];

	grunt.initConfig({
		primary: primary,
	 	experimental: primary.concat(experimental),

		concat: {
			options: {
				banner: '/** @preserve jinplace-extra - MIT Licence */'
			},

			dist: {
				src: "<%= primary %>",
				dest: "dist/jinplace-extra.js"
			},

			alldist: {
				src: "<%= experimental %>",
				dest: "dist/jinplace-extra-all.js"
			}
		},

		closurecompiler: {
			primary: {
				files: {
					'dist/jinplace-extra.min.js': ['dist/jinplace-extra.js']
				}
			},
			experimental: {
				files: {
					'dist/jinplace-extra-all.min.js': ['dist/jinplace-extra-all.js']
				}
			}
		},

		qunit: {
			files: [ "tests/index.html" ]
		},

		clean: {
			tidy: [ ],
			clobber: [ "node_modules" ]
		}

	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-closurecompiler');

	grunt.registerTask('clean', 'Clean easily rebuilt files', ['clean:tidy']);
	grunt.registerTask('clobber', 'Completely clean to checked out state', ['clean:clobber']);

	// Create a distribution set in the dist directory.  Obviously you
	// have to be updated to the correct tag before running this.
	grunt.registerTask('dist', 'Create a distibution file', ['concat', 'closurecompiler']);
};
