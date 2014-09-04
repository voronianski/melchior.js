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

	function eachReverse (arr, cb) {
		if (arr) {
			var i = arr.length;
			while (i--) {
				if (arr[i] && cb(arr[i], i, arr)) break;
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

	var mch = exports.melchiorjs = function (deps) {

	};

	mch.config = function (config) {
		mch(config);
		return this;
	};

	mch._createNode = function () {
		var node = document.createElement('script');
		node.type = 'text/javascript';
		node.charset = 'utf-8';
		node.async = true;
		return node;
	};

	mch._load = function (url) {
		var node = this._createNode();

		node.src = url;

		if (baseElement) {
			head.insertBefore(node, baseElement);
		} else {
			head.appendChild(node);
		}
	};

	mch._moduleTable = {};

	mch.module = function (modulePath) {
		return new ModuleLoader(modulePath);
	};

	mch._checkDependenciesResolved = function (moduleLoader) {
		for (var modulePath in moduleLoader._depTable) {
			var dep = mch._moduleTable[modulePath];
			if (dep && dep._loaded) {
				moduleLoader._loaded = true;
			}
		}
		return moduleLoader._loaded || false;
	};

	mch._refreshModuleState = function () {
		var moduleTable = mch._moduleTable;
		var newModuleLoaded = false;

		for (var modulePath in moduleTable) {
			var moduleLoader = moduleTable[modulePath];
			if (!moduleLoader._loaded) {
				newModuleLoaded = newModuleLoaded || mch._checkDependenciesResolved(moduleLoader);
			}
		}

		if (newModuleLoaded) {
			mch._refreshModuleState();
		}
	};

	function ModuleLoader (modulePath) {
		this.path = modulePath;
		this._depTable = {};
		this._body = null;
		this._depLength = 0;
		this._instance = null;
		this._loaded = false;

		mch._moduleTable[modulePath] = this;
	}

	ModuleLoader.prototype = {
		require: function (depModulePath, alias) {
			this._depTable[depModulePath] = { alias: alias };
			this._depLength++;

			return this;
		},

		run: function (fn) {
			this._body = fn;
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

			// transform functions for js objects parsing
			var transformFuncs = function (key, val) {
				if (typeof val === 'function') {
					return val.toString().replace(/(\t|\n|\r)/gm, '').replace(/("|')/gm, '\\"');
				}
				return val;
			};

			for (var modulePath in this._depTable) {
				var loader = mch._moduleTable[modulePath];
				var varName = this._depTable[modulePath].alias || modulePath;
				vars += ['var ', varName, ' = JSON.parse(\'', JSON.stringify(loader._instance, transformFuncs), '\', function (key, value) { if (value && typeof value === "string" && value.substr(0,8) == "function") { var startBody = value.indexOf("{") + 1; var endBody = value.lastIndexOf("}"); var startArgs = value.indexOf("(") + 1; var endArgs = value.indexOf(")"); return new Function(value.substring(startArgs, endArgs), value.substring(startBody, endBody)); } return value; });'].join('');
			}

			var wrapFn = new Function([vars, 'return (', this._body ,')();'].join(''));
			this._instance = wrapFn();
		}
	};

	mch(cfg);
})(this);
