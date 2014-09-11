melchiorjs.module('core')

// dot notation in namespaces is supported
// the value after last dot will be injected
.require('core.utils')
.require('core.basicView')

.run(function () {
	utils.track();
	basicView.render();
});
