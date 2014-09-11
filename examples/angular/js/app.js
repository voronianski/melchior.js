melchiorjs.module('core.app')

.require('angular')
// .require('ngRoute')

/*global angular*/
.body(function () {
	console.log('app', angular);
	var app = angular.module('app', []);

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
