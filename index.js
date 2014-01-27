module.exports.Base = require('./lib/paymentwall/base');
module.exports.Product = require('./lib/paymentwall/product');
module.exports.Widget = require('./lib/paymentwall/widget');
module.exports.Pingback = require('./lib/paymentwall/pingback');

module.exports.configure = function(apiType, appKey, secretKey) {
	module.exports.Base.prototype.apiType = apiType;
	module.exports.Base.prototype.appKey = appKey;
	module.exports.Base.prototype.secretKey = secretKey;
};