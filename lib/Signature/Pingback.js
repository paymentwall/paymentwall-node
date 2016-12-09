'use strict';

var Abstract = require('./Abstract');
var crypto = require('crypto');

exports.calculateSignature = function(params, secret, version) {
	var baseString = '';
	var params = params;
	var sig;

	if (params.sig) {
		sig = params.sig;
		delete params.sig;
	};

	version = parseInt(version);

	if (version !== 1) {
		baseString = Abstract.sortObject(params);        
	} else{
		baseString = "uid="+params.uid+"goodsid="+params.goodsid+"slength="+params.slength+"speriod="+params.speriod+"type="+params.type+"ref="+params.ref; 
	};
	baseString += secret;
	var algorithm = (version === 3) ? 'sha256' : 'md5';

	var shasum = crypto.createHash(algorithm).update(baseString);
	params.sig = sig;
	return shasum.digest('hex');
}