# MelchiorJS

[![Progress](http://img.shields.io/badge/Status-In Progress-red.svg?style=flat-square)](#usage)
[![build status](http://img.shields.io/travis/voronianski/melchior.js.svg?style=flat-square)](https://travis-ci.org/voronianski/melchior.js)

> Tiny JavaScript _in-browser_ module loader that implements **Chainable Module Definition** API.

_Melchior_ is the first library that fully implements the [Draft](https://github.com/tjwudi/wd.js/wiki/module-loader) proposed by [John Wu](https://github.com/tjwudi) and brings to life **"the most javascripty"** way to configure modules and its dependencies for in-browser use. 

_Melchior_ does not have dependencies on any JavaScript framework. It is small with around 3KB when minified.

[![Sauce Test Status](https://saucelabs.com/browser-matrix/voronianski.svg)](http://saucelabs.com)

## An alternative to AMD and RequireJS

The [idea](http://dailyjs.com/2014/07/14/alternative-module-api/) behind _chainable modules_ solves several nasty **AMD** patterns like long lines of declaring dependencies and provides simplicity and readability with its' visual-friendly and clean syntax. 

As **CommonJS** is more good for non-browser environments, _chaining modules with requires_ fit perfectly for in-browser use cases.

## Install

You can download all necessary _Melchior_ files manually or install it with [Bower](http://bower.io/):

```bash
bower install melchiorjs
```

## Usage

Common _Melchior_ module consists of the several parts and may look as follows:

```javascript
// create module
melchiorjs.module('yourModule')

// define dependencies
.require('dependencyUno')
.require('dependencyDuo')

// define the module body
.body(function () {
	// `dependencyUno` and `dependencyDuo` are available
	dependencyUno.doSomething();
	dependencyDuo.doSomething();

	// return methods for other modules
	return {
		method: function () { ... },
		anotherMethod: function () { ... }
	};
});
```

In the real world the most likely you will want to use other third-party libs. _Melchior_ also works as **dependency script loader** and provides similar config syntax as RequireJS does.

Firstly you will need to specify an entry point for all of your modules:

```html
<script src="/path/to/melchior.js" data-main="/path/to/entry.js"></script>
```

Inside `entry.js` call `melchiorjs.config()` with `paths` object inside that will include paths to the all libraries that you want to use as _Melchior_ modules.

```javascript
melchiorjs.config({
	paths: {
		// path key the same as global that lib exposes
		// saves from optional `shim` property on config
		'jQuery': 'path/to/jquery',
		'underscore': 'path/to/underscore',
		'myModule': 'path/to/myModule',
		'app': 'path/to/app'
	},

	// provide shim to non-melchior modules
	shim: {
		// declare the global returned by library
		underscore: {
			exports: '_'
		}
	}
});
```

For more detailed information on how `.config` works check [documentation](https://github.com/voronianski/melchior.js#configoptions).

From this point you will be able to `.require` dependencies. Modules names and `paths` keys should be the same in order to loader work properly.

```javascript
melchiorjs.module('app')

// provide any alias for module as second param
.require('jQuery', '$')
.require('underscore', 'fun')
.require('myModule')

.run(function () {
	$.get('/api/books').done(function (books) {
		var filtered = fun(books).sortBy('title');
		myModule.doSomethingWithBooks(filtered);
	});
});
```

This repo contains a special [examples](https://github.com/voronianski/melchior.js/tree/master/examples) folder where several types of applications using _Melchior_ are presented.

## Documentation

### config(options)

### module(name)

Create a module. You should specify a unique module name.

```javascript
melchiorjs.module('yourModule');
```

It is possible for module name to have the namespace. A valid namespace should consist of several words and be separated by dots (`.`). _Melchior_ takes the value after last dot as module name.

```javascript
// `utils` will be considered as module name
melchiorjs.module('core.utils');
```

### require(moduleName, [alias])

### run(fn)

### body(fn)

## Contribution

## References

## License

MIT Licensed

Copyright (c) 2014 Dmitri Voronianski [dmitri.voronianski@gmail.com](mailto:dmitri.voronianski@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
