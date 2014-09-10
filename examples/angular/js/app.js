melchiorjs.module('app')

.require('angular')
// .require('ngRoute')

/*global angular*/
.body(function () {
	var app = angular.module('app', []);

	app.boot = function () {
		angular.bootstrap(document, ['app']);
	};

	app.run(function ($rootScope) {
		$rootScope.version = '222';
	});

	return app;
});
