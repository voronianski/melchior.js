melchiorjs.config({
	paths: {
		'jQuery': 'js/vendor/jquery.js',

		// path name the same as global that lib exposes
		// saves from optional `shim` property on config
		'_': 'js/vendor/underscore.js',
		'BasicView': 'js/views/BasicView.js',
		'app': 'js/app.js'
	}
});
