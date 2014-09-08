(function (global, undefined) {
	'use strict';

	var cfg = {};
	var head = document.getElementsByTagName('head')[0];
	var commentRegExp = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/gm;

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
			cfg.deps = [mainScript];
			return true;
		}
	});

	// 1. Pass main.js to dependency tree
	// 2. Execute async fetching of scripts in require method
	// 3. When all required deps are ready run body/run method
	// 4. Inject dependencies as variables

	var mch = global.melchiorjs = function (config) {
		if (config.deps) {
			mch._injectMain(cfg.deps[0]);
		}
		cfg = config;

		if (cfg.paths) {
			eachProp(cfg.paths, function (url, path) {
				mch.load(url, function (script) {
					var js = '';
					script.content = script.content.replace(commentRegExp, '');
					if (script.content.match(/(melchiorjs)/g)) {
						js += script.content;
					} else {
						var exports = hasProp(cfg.shim, path) ? cfg.shim[path].exports : path;
						js += [
							script.content,
							';melchiorjs.module("',
							path,
							'").body(function () {',
							' return ', exports,
							';});'
						].join('');
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
					new Error(xhr.statusText);
				}
			}
		};
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
			// should provide modulePath
			console.log('--- no path provided', modulePath);
		} else if (!mch._moduleTable[modulePath]) {
			// module not registered
			console.log('--- not registered', modulePath);
		} else if (!mch._moduleTable[modulePath]._loaded) {
			// module not loaded
			console.log('--- not loaded', modulePath, mch._moduleTable);
		} else {
			console.log('--- boom', modulePath, mch._moduleTable, mch._moduleTable[modulePath]);
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
					deps.push({varName: varName, instance: instance});
				} else {
					return false;
				}
			}

			var wrapFn = function () {
				var scope = this;
				each(deps, function (dep) {
					scope[dep.varName] = dep.instance;
				});
				return (self._body)();
			};
			self._instance = wrapFn.call(global);
		}
	};

	mch(cfg);
})(this);
