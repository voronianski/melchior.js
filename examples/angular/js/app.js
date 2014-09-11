melchiorjs.module('app')

.require('angular')
.require('controllers')

/*global angular*/
.body(function () {
	'use strict';

	var app = angular.module('app', ['controllers']);

	app.boot = function () {
		console.log('app boot');
		angular.bootstrap(document, ['app']);
	};

	app.run(function ($rootScope) {
		console.log('app run');
		$rootScope.version = '222';
	});

	return app;
});
