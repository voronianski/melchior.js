melchiorjs.config({
	paths: {
		'angular': 'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.24/angular',
		// 'ngRoute': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.24/angular-route.js',
		'core.mainController': 'js/controllers/MainController',
		'app': 'js/app'
	}
})

.module('core')

.require('app')

/*global app*/
.run(function () {
	app.boot();
});