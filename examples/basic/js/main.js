melchiorjs.config({
	paths: {
		'jQuery': 'js/vendor/jquery.js',
		'underscore': 'js/vendor/underscore.js',
		'BasicView': 'js/views/BasicView.js',
		'app': 'js/app.js'
	},

	// path name the same as global that lib exposes
	// saves from optional `shim` property on config

	// provide shim to non-melchior modules
	// declaring name of global variable exposed by them
	shim: {
		underscore: {
			exports: '_'
		}
	}
});
