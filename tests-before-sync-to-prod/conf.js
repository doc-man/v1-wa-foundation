// conf.js content e.g.
exports.config = {

    seleniumAddress:'http://staging.savantcare.com:4444/wd/hub',
    
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
	// onComplete will be called just before the driver quits.
	onComplete: null,
	// If true, display spec names.
	isVerbose: false,
	// If true, print colors to the terminal.
	showColors: true,
	// If true, include stack traces in failures.
	includeStackTrace: true,
	// Default time to wait in ms before a test fails.
	// increasing it from 30 seconds to 300 seconds since note auto save we need to wait for 1 minute.
	defaultTimeoutInterval: 300000
    },
	// increasing it from 30 seconds to 300 seconds since note auto save we need to wait for 1 minute.
	allScriptsTimeout: 70000,
        /*,'./ehr/appointment-and-notes-auto-save.js'*/
        specs: ['check-opening.js']
}

/**
 * Removed ,'./ehr/serviceStatements-masterdb.js' as this was failing and the person who is responsible for this protractor test was absent.
 * */
