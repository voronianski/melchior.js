melchiorjs.module('core.mainController')

.require('core.app', 'app')

/*global app*/
.body(function () {
	console.log('555');
	return app.controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {
		console.log('2227');
		$scope.name = 'Taelon Synod';
		// $rootScope.version = '0.1.0-pre';
	}]);
});
