melchiorjs.module('MenuController')

.body(function () {
	'use strict';

	return function ($scope, $routeParams, $http) {
		$http.get('data/languages.json').success(function (data) {
			$scope.languages = data;
		});

		$scope.languageSearchQuery = '';

		$scope.navigationClass = function (language) {
			if (language.uid === $routeParams.language) {
				return 'active';
			}
			return null;
		};
	};
});
