melchiorjs.config({
	paths: {
		'jQuery': 'js/vendor/jquery.js'
	}
})
.module('app')
.require('jQuery', 'S')
.run(function () {
	console.log('run', S);
});
