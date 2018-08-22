module.exports = function(grunt) {
    var SOURCES = [
        'src/**/*.js'
    ];

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: { ///////////////////////////////////////////////////////////////
        options: {
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */',
        },
        dist: {
          src: SOURCES,
          dest: 'dist/<%= pkg.name %>.js',
        },
      },

      jshint: { ////////////////////////////////////////////////////////////
        all: ['Gruntfile.js', 'src/**/*.js']
      },

      uglify: { ////////////////////////////////////////////////////////////
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'dist/<%= pkg.name %>.js',
          dest: 'dist/<%= pkg.name %>.min.js'
        }
      }
    });
  
    //load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint'); 
    grunt.loadNpmTasks('grunt-contrib-uglify'); 

    // Register task(s).
    //Default task
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']); 
   
};