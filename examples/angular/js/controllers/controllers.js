melchiorjs.module('controllers')

.require('angular')
.require('MainController', 'Main')
.require('MenuController', 'Menu')
.require('LangController', 'Lang')

/*global angular, Main, Menu, Lang*/
.body(function () {
	'use strict';

	var ctrls = angular.module('controllers', []);

	ctrls.controller('MainController', Main);
	ctrls.controller('MenuController', Menu);
	ctrls.controller('LangController', Lang);

	return ctrls;
});
