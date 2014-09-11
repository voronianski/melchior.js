melchiorjs.module('LangController')

.body(function () {
	'use strict';

	return function ($scope, $routeParams, $http) {
		window.scrollTo(0,0);
		$http.get('data/' + $routeParams.language + '.json').success(function (data) {
			$scope.language = data;
		});
	};
});
