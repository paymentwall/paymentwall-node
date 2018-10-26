'use strict';

var Abstract = require('./Abstract');
var crypto = require('crypto');

exports.calculateSignature = function (params, secret, version) {
	var baseString = '';

	if (version === 1) {
		// TODO: throw exception if no uid parameter is present
		baseString += params['uid'] || '';
		baseString += secret;

		return crypto.createHash('md5').update(baseString).digest('hex');

	} else {
		
		if (params instanceof Object) {
			baseString = Abstract.sortObject(params);
		}

		baseString += secret;
		var algorithm = (version == 2) ? 'md5' : 'sha256';

		var shasum = crypto.createHash(algorithm).update(baseString, "utf8");

		return shasum.digest('hex');
	}
}