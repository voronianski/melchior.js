melchiorjs.config({
	paths: {
		'jQuery': 'js/vendor/jquery.js',
		'_': 'js/vendor/underscore.js'
	}
})
.module('app')
.require('jQuery', 'S')
.require('_', 'uu')
.run(function () {
	console.log('///', uu);
	console.log('run', S);
});
