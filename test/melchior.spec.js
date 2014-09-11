describe('melchiorjs', function () {
	var module;

	it('should be available in global scope', function () {
		expect(melchiorjs).toBeDefined();
	});

	describe('when creating a module', function () {
		beforeEach(function () {
			melchiorjs.module('TestModule');
			module = melchiorjs._moduleTable['TestModule']
		});

		it('should be added to global module table', function () {
			expect(module).toBeDefined();
		});

		it('should be not loaded unless body is executed', function () {
			expect(module._loaded).toBeFalsy();
		});

		it('should not have dependencies', function () {
			expect(module._depLength).toEqual(0);
		});
	});

	describe('when defining a module body', function () {
		beforeEach(function () {
			var bodyFn = function () {
				var base = 2;
				return {
					multiply: function (num) {
						return base*num;
					}
				};
			};
			melchiorjs.module('Multiplier').body(bodyFn);
			module = melchiorjs._moduleTable['Multiplier']
		});

		it('should be added to global module table', function () {
			expect(module).toBeDefined();
		});

		it('should not have dependencies', function () {
			expect(module._depLength).toEqual(0);
		});

		it('should be loaded when body is executed', function () {
			expect(module._loaded).toBeTruthy();
		});

		it('should have executed instance', function () {
			expect(module._instance['multiply']).toBeDefined();
		});

		it('should save reference to vars', function () {
			expect(module._instance['multiply'](5)).toEqual(10);
		});

		describe('when requiring a module', function () {
			beforeEach(function () {
				var bodyFn = function () {
					return M.multiply(10);
				};
				melchiorjs.module('core.User').require('Multiplier', 'M').body(bodyFn);
				module = melchiorjs._moduleTable['core.User']
			});

			it('should be added to global module table', function () {
				expect(module).toBeDefined();
			});

			it('should add alias for third-party inside module', function () {
				expect(module._depTable['Multiplier'].alias).toEqual('M');
			});

			it('should be loaded when body is executed', function () {
				expect(module._loaded).toBeTruthy();
			});

			it('should have dependencies', function () {
				expect(module._depLength).toEqual(1);
			});

			it('should have executed instance', function () {
				expect(module._instance).toEqual(20);
			});
		});
	});

	describe('when using config and third-party libs', function () {
		var thirdParty;
		var loadFlag = false;

		var bodyFn = function () {
			return S('body');
		};

		runs(function () {
			melchiorjs.config({
				paths: {'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'}
			})
			.module('TestApp').require('jQuery', 'S').run(bodyFn)
		});

		waitsFor(function (argument) {
			module = melchiorjs._moduleTable['TestApp'];
			thirdParty = melchiorjs._moduleTable['jQuery'];
			return !!thirdParty
		});

		it('should be added to global module table', function () {
			expect(module).toBeDefined();
		});

		it('should be loaded when body is executed', function () {
			expect(module._loaded).toBeTruthy();
		});

		it('should have dependencies', function () {
			expect(module._depLength).toEqual(1);
		});

		it('should add third-party to global module table', function () {
			expect(thirdParty).toBeDefined();
		});

		it('should be flag third-party as loaded too', function () {
			expect(thirdParty._loaded).toBeTruthy();
		});

		it('should add alias for third-party inside module', function () {
			expect(module._depTable['jQuery'].alias).toEqual('S');
		});
	});
});
