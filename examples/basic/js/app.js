melchiorjs.module('myApp')

// provide any alias for module as second param
.require('jQuery', 'jQ')
.require('BasicView')

/*global BasicView, jQ*/
.run(function () {
	BasicView.render();
	jQ('li:even').css('color', 'red');
});
