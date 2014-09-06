(function (exports, undefined) {
	'use strict';

	var cfg = {};
	var head = document.getElementsByTagName('head')[0];

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
			var i, l = arr.length;
			for (i = 0; i < l; i += 1) {
				if (arr[i] && cb(arr[i], i, arr)) break;
			}
		}
	}

	// Iterates over an array backwards.
	// Stops iteration if the callback returns a truthy value.
	function eachReverse (arr, cb) {
		if (arr) {
			var i = arr.length;
			while (i--) {
				if (arr[i] && cb(arr[i], i, arr)) break;
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
				if (cb(obj[prop], prop)) break;
			}
		}
	}

	// transform functions for js objects parsing
	function transformFuncs (key, val) {
		if (typeof val === 'function') {
			return val.toString().replace(/(\t|\n|\r)/gm, '').replace(/("|')/gm, '\\"');
		}
		return val;
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

	var mch = exports.melchiorjs = function (config) {
		if (config.deps) {
			mch._injectMain(cfg.deps[0]);
		}
		cfg.paths = config.paths;

		if (cfg.paths) {
			eachProp(cfg.paths, function (url, path) {
				mch.load(url, function (script) {
					console.log('LOADED ', url);
					var js = '';
					script.content = script.content.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/gm, '');
					if (script.content.match(/(melchiorjs)/g)) {
						js += script.content;
					} else {
						js += [
							script.content,
							';melchiorjs.module("',
							path,
							'").body(function () {',
							' return ', path,
							';});'
						].join('');
					}
					js += 'melchiorjs.inject("'+path+'");';
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

		script.onload = script.onerror = script['onreadystatechange'] = function (e) {
			if ((script['readyState'] && !(/^c|loade/.test(script['readyState']))) || loaded) return;
			script.onload = script['onreadystatechange'] = null;
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

	mch.inject = function (modulePath) {
		console.log('Inject ', modulePath);
		mch.emit('resolved', modulePath);
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
		console.log('EMIT: ', name, e);
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
			return mch._moduleTable[modulePath]['_instance'];
		}
	};

	mch._checkDependenciesResolved = function (moduleLoader) {
		console.log('CHECK DEPS RESOLVED FOR: ', moduleLoader.path, moduleLoader._loaded, moduleLoader._depTable);
		for (var modulePath in moduleLoader._depTable) {
			var dep = mch._moduleTable[modulePath];
			if (!dep || !dep._loaded) return false;
		}

		moduleLoader._loaded = true;
		return true;
	};

	mch._refreshModuleState = function () {
		var newModuleLoaded = false;

		eachProp(mch._moduleTable, function (moduleLoader, modulePath) {
			if (!moduleLoader._loaded) {
				newModuleLoaded = newModuleLoaded || mch._checkDependenciesResolved(moduleLoader);
				console.log('REFRESH STATE: ', newModuleLoaded);
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
			var self = this;
			this._depTable[depModulePath] = { alias: alias };
			this._depLength++;

			// if depModulePath is not resolved and executed
			// attach listener to it to know when it will be available
			if (!hasProp(mch._moduleTable, depModulePath)) {
				mch.on('resolved', function (e) {
					if (e === depModulePath) {
						self.run();
					}
					// if (!mch._moduleTable[depModulePath]._loaded) {

					// }
				});
			}

			console.log('REQUIRE FROM: ', this.path, 'WHAT: ', depModulePath);
			console.log('GLOBAL MODULE TABLE: ', mch._moduleTable, hasProp(mch._moduleTable, depModulePath) && !mch._moduleTable[depModulePath]._loaded);
			// mch.on('wrapped', function (e) {
			// 	console.log('WRAPPED', e, depModulePath, self.path);
			// 	if (e === depModulePath) {
			// 		self.run();
			// 	}
			// });

			// subscribe to wrapped event if has unresolved deps
			if (hasProp(mch._moduleTable, depModulePath) && !mch._moduleTable[depModulePath]._loaded) {
				mch.on('wrapped', function (e) {
					console.log('WRAPPED:', e, 'REQUIRED: ', depModulePath, 'ON: ', self.path);
					if (e === depModulePath) {
						self.run();
					}
				});
			}

			return this;
		},

		run: function (fn) {
			if (fn) {
				this._body = fn;
			}

			mch._refreshModuleState();
			this._exec();

			return this;
		},

		body: function (fn) {
			this._body = fn;

			if (this._depLength === 0) {
				this._exec();
				return;
			}

			mch._refreshModuleState();
			this._exec();
		},

		// that's where some crazy magic appears!
		// parses module code and injects it inside `body` or `run`
		_exec: function () {
			var vars = '';

			console.log('EXEC DEPS: ', this._depTable, this.path);
			for (var modulePath in this._depTable) {
				var instance = mch._getModuleInstance(modulePath);

				console.log('INSTANCE: ', instance, 'FOR PATH:', modulePath);
				if (instance) {
					var varName = this._depTable[modulePath].alias || modulePath;
					console.log('VAR NAME: ', varName);
					vars += ['var ', varName, ' = JSON.parse(\'', JSON.stringify(instance, transformFuncs), '\', function (key, value) { if (value && typeof value === "string" && value.substr(0,8) == "function") { var startBody = value.indexOf("{") + 1; var endBody = value.lastIndexOf("}"); var startArgs = value.indexOf("(") + 1; var endArgs = value.indexOf(")"); return new Function(value.substring(startArgs, endArgs), value.substring(startBody, endBody)); } return value; });'].join('');
				} else {
					return false;
				}
			}

			var wrapFn = new Function([vars, ' return (', this._body, ')();'].join(''));
			console.log('WRAPFN: ', wrapFn);
			this._instance = wrapFn();
			mch.emit('wrapped', this.path.toString());

		}
	};

	mch(cfg);
})(this);
