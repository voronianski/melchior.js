melchiorjs.config({
	paths: {
		'jQuery': 'js/vendor/jquery'
	}
})
.require('jQuery', '$')
.run(function () {
	var books = [{title: 'Princess Maia'}, {title: 'Princess Nuri'}];
	var $listWrap = $('#list');

	_(books).each(function (book) {
		$listWrap.append('<li>' + book.title + '</li>');
	});
});
