melchiorjs.module('core')

.require('core.utils')
.require('core.basicView')

.run(function () {
	utils.track();
	basicView.render();
});
