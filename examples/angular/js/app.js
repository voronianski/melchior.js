melchiorjs.module('app')

.require('angular')
.require('ngRoute')
.require('controllers')

/*global angular*/
.body(function () {
	'use strict';

	var app = angular.module('app', ['ngRoute', 'controllers']);

	app.boot = function () {
		angular.bootstrap(document, ['app']);
	};

	app.config(['$routeProvider',
		function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/all', { templateUrl: 'MainView', controller: 'MainController' })
				.otherwise({ redirectTo: '/' });
		}
	]);

	app.run(function ($rootScope) {
		$rootScope.version = '0.1.0-pre';
	});

	return app;
});
