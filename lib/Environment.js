'use strict';

// check the runtime environment
exports.checkRuntimeEnv = function() {
	var runtimeEnv;
	if (typeof (process) !== 'undefined' && process.versions) {
	    if (process.versions.nw) {
	    	runtimeEnv = 'nw';
	    } else if (process.versions.node) {
	    	runtimeEnv = 'node';
	    };
	};
	if (!runtimeEnv && typeof (window) !== 'undefined' &&
	    window.window === window) {
		runtimeEnv = 'browser';
	    console.log('Browser is deprecated for this library');
	};
	if (!runtimeEnv) {
	    throw new Error('unknown runtime environment');
	};
	return runtimeEnv;
}