# MelchiorJS

[![NPM version](http://img.shields.io/badge/Status-In Progress-red.svg?style=flat-square)](#usage)
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg?style=flat-square)](#License)

Tiny JavaScript _in-browser_ module loader that implements [Chainable Module Definition (CMD)](https://github.com/tjwudi/wd.js/wiki/module-loader) API proposed by [John Wu](https://github.com/tjwudi).

## Install

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

## References

## License

MIT Licensed

Copyright (c) 2014 Dmitri Voronianski [dmitri.voronianski@gmail.com](mailto:dmitri.voronianski@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
