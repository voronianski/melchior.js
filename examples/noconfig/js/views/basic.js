melchiorjs.module('core.basicView')

.body(function () {
	return {
		render: function () {
			var books = [{title: 'Princess Maia'}, {title: 'Princess Noori'}, {title: 'Princess Gita'}];
			var $listWrap = $('#list');

			_(books).each(function (book) {
				$listWrap.append('<li>' + book.title + '</li>');
			});
		}
	};
});
