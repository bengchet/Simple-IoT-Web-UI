module.exports = function(grunt) {

  grunt.initConfig({
    jsDir: 'dist/js/',
    jsDistDir: 'js/',    
    cssDir: 'css/',
    cssDistDir: 'css/',
    imagemin: {
       dist: {
          options: {
            optimizationLevel: 5
          },
          files: [{
             expand: true,
             cwd: 'img',
             src: ['**/*.{png,jpg,gif}'],
             dest: 'img/'
          }]
       }
    },
    concat: {
      js: {
        src: [
	      "<%=jsDir%>angular.min.js",
	      "<%=jsDir%>moment.js",
	      "<%=jsDir%>angular-moment.min.js",
              "<%=jsDir%>ng-map.min.js",
	      "<%=jsDir%>highcharts.src.js",
	      "<%=jsDir%>highcharts-ng.min.js",
	      "<%=jsDir%>ui-bootstrap-tpls.js",
	      "<%=jsDir%>mqttws31.js",
	      "<%=jsDir%>angular-paho.js"
              ],
        dest: '<%=jsDistDir%>app.js'
      },
      css: {
        src: [
              '<%=cssDir%>bootstrap.min.css',
	      '<%=cssDir%>font-awesome.min.css',
              '<%=cssDir%>style.css',
             ],
        dest: '<%=cssDistDir%>app.css'
      }
    },
    uglify: {
      dist: {
        files: [{
             expand: true,
             cwd: 'js',
             src: ['**/*.js', '!main.js', '!app.js'],
             dest: 'dist/js/'
        }]
      }
    },
    cssmin: {
      add_banner: {
        files: {
          '<%=cssDistDir%>app.css': ['<%= concat.css.dest %>']
        }
      }
    },
    clean: ['dist'],
    watch: {
    	files: ['<%=jsDir%>*.js', '<%=cssDir%>*.css'],
    	tasks: ['concat', 'uglify', 'cssmin']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [
    'uglify',
    'concat',
    'cssmin',
    'clean'
  ]);
  
};
