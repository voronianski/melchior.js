melchiorjs.module('app')

.require('angular')
.require('ngRoute')
.require('ngResource')
.require('controllers')

/*global angular*/
.body(function () {
	'use strict';

	var app = angular.module('app', ['ngRoute', 'ngResource', 'controllers']);

	app.boot = function () {
		angular.bootstrap(document, ['app']);

		document.getElementById('load').style.display = 'none';
		document.getElementById('app').style.display = 'block';
	};

	app.config(['$routeProvider',
		function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', { templateUrl: 'MainView', controller: 'MainController' })
				.when('/languages/:language', { templateUrl: 'LangView', controller: 'LangController' })
				.otherwise({ redirectTo: '/' });
		}
	]);

	return app;
});
