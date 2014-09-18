module.exports = function (config) {

	if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
		console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
		process.exit(1);
	}

	// Browsers to run on Sauce Labs
	// https://saucelabs.com/platforms
	var customLaunchers = {
		'SL_Chrome_Win': {
			base: 'SauceLabs',
			browserName: 'chrome',
			platform: 'Windows 7'
		},
		'SL_Firefox_Win_31': {
			base: 'SauceLabs',
			browserName: 'firefox',
			platform: 'Windows 7',
			version: '31'
		},
		'SL_Firefox_Win_3': {
			base: 'SauceLabs',
			browserName: 'firefox',
			platform: 'Windows 7',
			version: '3.6'
		},
		'SL_Safari': {
			base: 'SauceLabs',
			browserName: 'safari',
			platform: 'OS X 10.9'
		},
		'SL_iPhone_Safari_7': {
			base: 'SauceLabs',
			browserName: 'iphone',
			platform: 'OS X 10.9',
			version: '7.1'
		},
		'SL_iPhone_Safari_6': {
			base: 'SauceLabs',
			browserName: 'iphone',
			platform: 'OS X 10.9',
			version: '6'
		},
		'SL_Android': {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '4.4'
		},
		'SL_IE_11': {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '11'
		},
		'SL_IE_9': {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '9'
		},
		'SL_IE_8': {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '8'
		},
		'SL_Opera_12': {
			base: 'SauceLabs',
			browserName: 'opera',
			platform: 'Windows 7',
			version: '12'
		},
		'SL_Opera_10': {
			base: 'SauceLabs',
			browserName: 'opera',
			platform: 'Windows 7',
			version: '10'
		}
	};

	config.set({
		basePath: '',

		frameworks: ['jasmine'],

		files: [
			'src/melchior.js',
			'test/melchior.spec.js'
		],

		reporters: ['progress', 'saucelabs'],

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		sauceLabs: {
			testName: 'MelchiorJS Unit Tests',
			recordScreenshots: false,
			connectOptions: {
				port: 5757,
				logfile: 'sauce_connect.log'
			}
		},

		// Increase timeout in case connection in CI is slow
		captureTimeout: 720000,

		idleTimeout: 180,

		customLaunchers: customLaunchers,

		browsers: Object.keys(customLaunchers),

		singleRun: true
	});
};
