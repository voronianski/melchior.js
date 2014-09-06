melchiorjs.config({
	paths: {
		'jQuery': 'js/vendor/jquery.js',

		// path name the same as the global that lib exposes
		// saves from optional `shim` option
		'_': 'js/vendor/underscore.js'
	}
})

.module('myApp')

// provide any alias for module as second param
.require('jQuery', 'jQ')
.require('_')

.run(function () {
	'use strict';

	var books = [{title: 'Princess Maia'}, {title: 'Princess Noori'}, {title: 'Princess Gita'}];
	var $listWrap = jQ('#list');

	_(books).each(function (book) {
		$listWrap.append('<li>' + book.title + '</li>');
	});
});
