module.exports = function(grunt){
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
 
		watch:{
			options:{
				livereload: true
			},
			files:['js/**','css/**','*.html','json/**'],
		},
  		express:{
  			all:{
  				options:{
  					port: 3000,
  					hostname:'localhost',
  					bases:['.'],
  					livereload: true	
  				}
  			}
  		},
		open: {
		    all: {
		        path: 'http://localhost:3000/index.html'
		    }
		}
	});

	grunt.registerTask('default',['express','open', 'watch']);
 
};