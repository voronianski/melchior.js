melchiorjs.config({
	paths: {
		'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.24/angular',
		'ngRoute': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.24/angular-route',
		'ngResource': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.24/angular-resource',
		'MainController': 'js/controllers/MainController',
		'MenuController': 'js/controllers/MenuController',
		'LangController': 'js/controllers/LangController',
		'controllers': 'js/controllers/controllers',
		'app': 'js/app'
	},
	shim: {
		ngRoute: {
			deps: ['angular']
		},
		ngResource: {
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
