(function (exports, undefined) {
	'use strict';

	var mch = exports.melchiorjs = {};

	mch.config = function (options) {

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

	ModuleLoader.prototype.require = function (depModulePath, alias) {
		this._depTable[depModulePath] = { alias: alias };
		this._depLength++;

		return this;
	};

	ModuleLoader.prototype.run = function (fn) {
		this._body = fn;
		this._exec();

		return this;
	};

	ModuleLoader.prototype.body = function (fn) {
		this._body = fn;

		if (this._depLength === 0) {
			this._exec();
			return;
		}

		mch._refreshModuleState();
		this._exec();
	};

	ModuleLoader.prototype._exec = function () {
		var vars = '';
		var iterate = function (key, val) {
			if (typeof val === 'function') {
				return '' + val;
			}
			return val;
		};
		for (var modulePath in this._depTable) {
			var loader = mch._moduleTable[modulePath];
			var varName = this._depTable[modulePath].alias || modulePath;
			vars += ['var ', varName, ' = ', JSON.stringify(loader._instance, iterate), ';'].join('');
		}
		var wrapFn = new Function([vars, 'return (', this._body ,')();'].join(''));
		this._instance = wrapFn();
	};

})(this);
