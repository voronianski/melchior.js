melchiorjs.config({
	paths: {
		'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.24/angular',
		'ngRoute': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.24/angular-route.js',
		'MainController': 'js/controllers/MainController',
		'controllers': 'js/controllers/controllers',
		'app': 'js/app'
	},
	shim: {
		ngRoute: {
			deps: ['angular']
		}
	}
})

.module('core')

.require('app')

/*global app*/
.run(function () {
	app.boot();
});
