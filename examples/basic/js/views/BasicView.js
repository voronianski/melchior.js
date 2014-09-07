melchiorjs.module('BasicView')

// provide any alias for module as second param
.require('jQuery', 'jQ')
.require('_', 'uu')

.body(function () {
	'use strict';

	return {
		render: function () {
			var books = [{title: 'Princess Maia'}, {title: 'Princess Noori'}, {title: 'Princess Gita'}];
			var $listWrap = jQ('#list');

			uu(books).each(function (book) {
				$listWrap.append('<li>' + book.title + '</li>');
			});
		}
	};
});
