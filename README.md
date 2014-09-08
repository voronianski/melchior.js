# MelchiorJS

[![NPM version](http://img.shields.io/badge/Status-In Progress-red.svg?style=flat-square)](#usage)
[![build status](http://img.shields.io/travis/voronianski/melchior.js.svg?style=flat-square)](https://travis-ci.org/voronianski/melchior.js)
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg?style=flat-square)](#license)

Tiny JavaScript _in-browser_ module loader that implements **Chainable Module Definition (CMD)** API.

_Melchior_ is the first library that fully implements the [Draft](https://github.com/tjwudi/wd.js/wiki/module-loader) proposed by [John Wu](https://github.com/tjwudi) and brings to life **"the most javascripty"** way to configure modules and its dependencies for in-browser use. 

_Melchior_ does not have dependencies on any JavaScript framework. It is small with around 3KB when minified.

## An alternative to AMD

The [idea](http://dailyjs.com/2014/07/14/alternative-module-api/) behind _chainable modules_ solves several nasty **AMD** patterns like long lines of declaring dependencies (:tired_face:) and provides simplicity and readability with its' visual-friendly and clean syntax. 

As **CommonJS** is more good for non-browser environments, _chaining modules with requires_ fit perfectly for in-browser use cases. 

You may notice that **CMD** might be not a good choice for short namr because there is already existing [Common Module Definition](https://github.com/cmdjs/specification/blob/master/draft/module.md), that's why alternatives like **ChMD** or **ChainMD** are possible options.

## Install

You can download all necessary _Melchior_ files manually or install it with [Bower](http://bower.io/):

```bash
bower install melchiorjs
```

## Usage

```javascript
melchiorjs.module('name')
.require('depOne')
.require('depTwo')
.body(function () {
	depOne.doSomething();
	depTwo.doSomething();

	return {
		method: function () { ... },
		anotherMethod: function () { ... }
	};
});
```

In real world the most likely you will want to use other third-party libs.

Firstly it is necessary to specify entry point for all of your modules:

```html
<script src="/path/to/melchior.js" data-main="/path/to/entry.js"></script>
```

Melchior provides special ``.config()`` where you need to specify paths for all libs that you want to use:

```javascript
melchiorjs.config({
	paths: {
		'jQuery': 'path/to/jquery',
		'underscore': '/path/to/underscore',
		'myModule': '/path/to/myModule'
	}
});
```

Now you will be able to require dependencies. Also it is allowed to specify an alias for dependency as the second parameter:

```javascript
melchiorjs
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

### module(name)

### require(moduleName, [alias])

### run([fn])

### body(fn)

### config(options)

### 

## References

## License

MIT Licensed

Copyright (c) 2014 Dmitri Voronianski [dmitri.voronianski@gmail.com](mailto:dmitri.voronianski@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
