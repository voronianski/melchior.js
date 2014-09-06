melchiorjs.module('myApp')

.require('BasicView')

.run(function () {
	console.log('APP STARTED');
	BasicView.render();
});
