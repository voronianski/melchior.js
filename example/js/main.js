melchiorjs.config({
	baseUrl: '/js',
	paths: {
		'jQuery': 'path/to/jquery',
		'underscore': '/path/to/underscore'
	}
})
.require('jQuery', '$')
.require('underscore', '_')
.run(function () {
	var books = [{title: 'Princess Maia'}, {title: 'Princess Nuri'}];
	var $listWrap = $('#list');

	_(books).each(function (book) {
		$listWrap.append('<li>' + book.title + '</li>');
	});
});
