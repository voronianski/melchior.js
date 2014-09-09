melchiorjs.config({
	paths: {
		// path name the same as global that lib exposes
		// saves from optional `shim` property on config
		'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
		'underscore': 'js/vendor/underscore',
		'BasicView': 'js/views/BasicView',
		'app': 'js/app'
	},

	// provide shim to non-melchior modules
	// declaring name of global variable exposed by them
	shim: {
		underscore: {
			exports: '_'
		}
	}
});
