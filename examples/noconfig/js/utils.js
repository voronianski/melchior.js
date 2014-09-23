var glob = true;

melchiorjs.module('core.utils')
.body(function () {
	var i = 123;
	return {
		track: function () {
			console.log('Tracking method called. ', i, glob);
		}
	};
});
