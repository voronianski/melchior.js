melchiorjs.module('BasicView')

// provide any alias for module as second param
.require('jQuery', 'jQ')
.require('underscore', 'u')

/*global jQ, u*/
.body(function () {
	'use strict';

	return {
		render: function () {
			var books = [
				{title: 'Princess Maia'},
				{title: 'Princess Noori'},
				{title: 'Princess Gita'},
				{title: 'Princess Tito'},
				{title: 'Princess Kandi'}
			];
			var $listWrap = jQ('#list');

			u(books).each(function (book) {
				$listWrap.append('<li>' + book.title + '</li>');
			});
		}
	};
});
