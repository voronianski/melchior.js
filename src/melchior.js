(function (global, undefined) {
	'use strict';

	var cfg = {};
	var head = document.getElementsByTagName('head')[0];
	var jsSuffixRegExp = /\.js$/;

	// Related to bug - http://dev.jquery.com/ticket/2709
	// If <BASE> tag is in play, using appendChild is a problem for IE6.
	var baseElement = document.getElementsByTagName('base')[0];
	if (baseElement) {
		head = baseElement.parentNode;
	}

	function getScripts () {
		return document.getElementsByTagName('script');
	}

	// Iterates over an array.
	// Stops iteration if the callback returns a truthy value.
	function each (arr, cb) {
		if (arr) {
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i]) {
					cb(arr[i], i, arr);
				}
			}
		}
	}

	// Iterates over an array backwards.
	// Stops iteration if the callback returns a truthy value.
	function eachReverse (arr, cb) {
		if (arr) {
			var i = arr.length;
			while (i--) {
				if (arr[i] && cb(arr[i], i, arr)) {
					break;
				}
			}
		}
	}

	function isArray (val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	}

	function hasProp (obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	// Cycles over properties in an object and calls a function for each property.
	// Stops iteration if the callback returns a truthy value.
	function eachProp (obj, cb) {
		var prop;
		for (prop in obj) {
			if (hasProp(obj, prop)) {
				if (cb(obj[prop], prop)) {
					break;
				}
			}
		}
	}

	eachReverse(getScripts(), function (script) {
		var mainScript = script.getAttribute('data-main');
		if (mainScript) {
			cfg.main = mainScript;
			return true;
		}
	});

	var mch = global.melchiorjs = function (config) {
		if (config.main) {
			mch._injectMain(cfg.main);
		}

		cfg = config;
		cfg.timeout = cfg.timeout || 5000;
		cfg.shim = cfg.shim || {};

		if (cfg.paths) {
			eachProp(cfg.paths, function (url, path) {
				// support extenstion ommited paths
				var routes = url.split('/');
				var lastIndex = routes.length - 1;
				if (!jsSuffixRegExp.test(routes[lastIndex])) {
					routes[lastIndex] += '.js';
					url = routes.join('/');
				}

				mch.load(url, function (script) {
					var js = '';
					if (script.content.match(/(melchiorjs)/g)) {
						js += script.content;
					} else {
						var hasShim = hasProp(cfg.shim, path);
						var exports = hasShim && cfg.shim[path].exports ? cfg.shim[path].exports : path;
						var depends = hasShim && cfg.shim[path].deps ? cfg.shim[path].deps : [];
						var requires = '';

						if (isArray(depends) && depends.length > 0) {
							requires += '.require("' + depends.join('").require("') + '")';
							js += [
								';melchiorjs.module("', path, '")',
								requires,
								'.body(function () {',
								script.content,
								' ;return',
								'(typeof ', exports, ' === "undefined" ? true : ', exports, ');',
								'});'
							].join('');
						} else {
							js += [
								script.content,
								';melchiorjs.module("', path,
								'").body(function () {',
								' return ', exports,
								'; });'
							].join('');
						}
					}
					mch._injectScript(js);
				});
			});
		}

		return mch;
	};

	mch.config = function (config) {
		return mch(config);
	};

	mch._createScript = function () {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.charset = 'utf-8';
		script.defer = true;
		script.async = true;
		return script;
	};

	mch._injectMain = function (url) {
		var script = this._createScript();
		var loaded;

		script.onload = script.onerror = script.onreadystatechange = function (e) {
			if ((script.readyState && !(/^c|loade/.test(script.readyState))) || loaded) {
				return;
			}
			script.onload = script.onreadystatechange = null;
			loaded = true;
		};

		script.src = url;
		this._appendScript(script);
	};

	mch._injectScript = function (content) {
		var script = this._createScript();

		script.text = content;
		this._appendScript(script);
	};

	mch._appendScript = function (script) {
		if (baseElement) {
			head.insertBefore(script, baseElement);
		} else {
			head.appendChild(script);
		}
	};

	mch.load = function (url, cb) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					cb({
						content: xhr.responseText,
						type: xhr.getResponseHeader('content-type')
					});
				} else {
					throw new Error('Cannot load module for url: ' + url);
				}
			}
		};

		// adding configurable timeout
		// XHR never timeouts by default
		setTimeout(function () {
			if (xhr.readyState < 4) {
				xhr.abort();
			}
		}, cfg.timeout);

		xhr.send();
	};

	mch._events = {};

	mch.on = function (name, cb) {
		var cbs = this._events[name];
		if (!cbs) {
			cbs = this._events[name] = [];
		}
		cbs.push(cb);
	};

	mch.emit = function (name, e) {
		each(this._events[name], function (cb) {
			cb(e);
		});
	};

	mch._moduleTable = {};

	mch.module = function (modulePath) {
		return new Module(modulePath);
	};

	mch._getModuleInstance = function(modulePath) {
		if (!modulePath) {
			throw new Error('Module path is not provided');
		} else if (!mch._moduleTable[modulePath]) {
			throw new Error('Module "' + modulePath+ '" is not registered');
		} else if (!mch._moduleTable[modulePath]._loaded) {
			throw new Error('Module "' + modulePath+ '" is not loaded');
		} else {
			return mch._moduleTable[modulePath]._instance;
		}
	};

	mch._checkDependenciesResolved = function (moduleLoader) {
		for (var modulePath in moduleLoader._depTable) {
			var dep = mch._moduleTable[modulePath];
			if (!dep || !dep._loaded) {
				return false;
			}
		}

		// when module is loaded fire an event to notify all dependencies
		moduleLoader._loaded = true;
		mch.emit('ready', moduleLoader);
		return true;
	};

	mch._refreshModuleState = function () {
		var newModuleLoaded = false;

		eachProp(mch._moduleTable, function (moduleLoader, modulePath) {
			if (!moduleLoader._loaded) {
				newModuleLoaded = newModuleLoaded || mch._checkDependenciesResolved(moduleLoader);
			}
		});

		if (newModuleLoaded) {
			mch._refreshModuleState();
		}
	};

	function Module (modulePath) {
		this.path = modulePath;
		this._depTable = {};
		this._depLength = 0;
		this._loaded = false;

		mch._moduleTable[modulePath] = this;
	}

	Module.prototype = {
		require: function (depModulePath, alias) {
			this._depTable[depModulePath] = { alias: alias };
			this._depLength++;

			return this;
		},

		run: function (fn) {
			if (fn) {
				this._body = fn;
			}

			this._run();
		},

		body: function (fn) {
			this._body = fn;

			if (this._depLength === 0) {
				this._loaded = true;
				mch.emit('ready', this);
			}

			this._run();
		},

		_run: function () {
			var self = this;

			mch._refreshModuleState();

			if (self._loaded) {
				self._exec();
			} else {
				mch.on('ready', function (mod) {
					if (mod.path === self.path) {
						setTimeout(function () {
							self._exec();
						}, 0);
					}
				});
			}
		},

		// that's where some crazy magic appears!
		// parses module code and injects it inside `body` or `run`
		_exec: function () {
			var self = this;
			var deps = [];

			for (var modulePath in self._depTable) {
				var instance = mch._getModuleInstance(modulePath);
				if (instance) {
					var varName = self._depTable[modulePath].alias || modulePath;
					// support for dot notation modules, e.g. `core.foo`
					if (/(\.)/.test(varName)) {
						var l = varName.split('.');
						varName = l[l.length-1];
					}
					deps.push({varName: varName, instance: instance});
				} else {
					return false;
				}
			}

			// var wrapFn = function () {
			// 	var scope = this;
			// 	each(deps, function (dep) {
			// 		scope[dep.varName] = dep.instance;
			// 	});
			// 	return (self._body)();
			// };

			var wrapFn = function () {
				var wrapperArgsName = [];
				var wrapperArgsValue = [];

				each(deps, function (dep) {
					wrapperArgsName.push(dep.varName);
					wrapperArgsValue.push(dep.instance);
				});

				var fullBody = self._body.toString();
				var body = fullBody.substring(fullBody.indexOf('{') + 1, fullBody.lastIndexOf('}'));

				return Function
					.apply(Function, wrapperArgsName.concat([body]))
					.apply(null, wrapperArgsValue);
			};
			self._instance = wrapFn.call(global) || '__executed__';
		}
	};

	mch(cfg);
})(this);
