melchiorjs.module('core.mainController')

.require('app')

/*global app*/
.body(function () {
	console.log('555');
	app.controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {
		console.log('2227');
		// $rootScope.version = '0.1.0-pre';
	}]);
});
