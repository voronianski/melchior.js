# MelchiorJS

Ready for use, tiny JavaScript in-browser module loader that implements [Chainable Module Definition (CMD)](https://github.com/tjwudi/wd.js/wiki/module-loader) API proposed by [John Wu](https://github.com/tjwudi).

## Install

## Usage

```javascript
mch.module('moduleName')
.require('dependencyOne')
.require('dependencyTwo')
.body(function () {
	dependencyOne.doSomething();
	dependencyTwo.doSomething();

	return {
		method: function () { ... },
		anotherMethod: function () { ... }
	}
});
```

In real world the most likely you will want to use other third-party libs. Firstly it is necessary to specify entry point for all of your modules:

```html
<script src="/path/to/melchior.js" data-main="/path/to/entry.js" type="text/javascript"></script>
```

Melchior provides special ``.config()`` where you need to specify paths for all libs that you want to use:

```javascript
mch.config({
	paths: {
		'jQuery': 'path/to/jquery',
		'underscore': '/path/to/underscore',
		'myModule': '/path/to/myModule'
	}
});
```

Now you will be able to require dependencies. You're allowed tp specify an alias for dependency as the second parameter.

```javascript
mch.module()
.require('jQuery', '$')
.require('underscore', '_')
.require('myModule')
.run(function () {
	$.get('/api/books').done(function (books) {
		var filtered = _(books).sortBy('title');
		myModule.doSomethingWithBooks(filtered);
	});
});
```

## API

## References

## License
