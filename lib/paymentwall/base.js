Base.API_VC = 1;
Base.API_GOODS = 2;
Base.API_CART = 3;
Base.SIGNATURE_VERSION_1 = 1;
Base.SIGNATURE_VERSION_2 = 2;
Base.SIGNATURE_VERSION_3 = 3;
Base.DEFAULT_SIGNATURE_VERSION = 3;

function Base() {
}

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

	getBaseString: function(params, secret, version) {
		var baseString = '';
		version = parseInt(version);

		var getOrderedKeys = function(obj) {
			var keys = Object.keys(obj);

			if (version !== Base.SIGNATURE_VERSION_1) {
				if (obj instanceof Object) {
					keys.sort();
				}
			}

			return keys;
		};

		getOrderedKeys(params).forEach(function(key) {
			if (key === 'sig') {
				return;
			}

			var value = params[key];

			if (value instanceof Object) {
				getOrderedKeys(value).forEach(function(k) {
					var v = value[k];
					if (v !== undefined) {
						baseString += key + '[' + k + ']' + '=' + v;
					}
				});
			} else {
				if (value !== undefined) {
					baseString += key + '=' + value;
				}
			}
		});

		baseString += secret;

		return baseString;
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
