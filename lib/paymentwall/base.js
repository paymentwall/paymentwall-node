Base.API_VC = 1;
Base.API_GOODS = 2;
Base.API_CART = 3;
Base.SIGNATURE_VERSION_1 = 1;
Base.SIGNATURE_VERSION_2 = 2;
Base.SIGNATURE_VERSION_3 = 3;
Base.DEFAULT_SIGNATURE_VERSION = 3;

function Base() {}

Base.prototype = {
	VC_CONTROLLER: 'ps',
	GOODS_CONTROLLER: 'subscription',
	CART_CONTROLLER: 'cart',

	errors: [],

	getApiType: function() {
		return this.apiType;
	},

	getAppKey: function() {
		return this.appKey;
	},

	getSecretKey: function() {
		return this.secretKey;
	},

	objectMerge: function(a, b) {
		for (var x in b) a[x] = b[x];
			return a;
	},

	sortObject: function(o) {
		var sorted = {},
			key, a = [];

		for (key in o) {
			if (o.hasOwnProperty(key)) {
				a.push(key);
			}
		}

		a.sort();

		for (key = 0; key < a.length; key++) {
			sorted[a[key]] = o[a[key]];
		}

		return sorted;
	},

	appendToErrors: function(err) {
		return this.errors.push(err);
	},

	getErrors: function() {
		return this.errors;
	},

	getErrorSummary: function() {
		return this.getErrors().join("\n");
	}
};

module.exports = Base;