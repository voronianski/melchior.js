melchiorjs.module('controllers')

.require('angular')
.require('MainController')

/*global angular, MainController*/
.body(function () {
	'use strict';

	console.log('Controllers');
	var ctrls = angular.module('controllers', []);

	ctrls.controller('MainController', MainController);

	return ctrls;
});
