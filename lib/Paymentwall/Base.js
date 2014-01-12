var hasOwn = {}.hasOwnProperty;

var PaymentwallBase = {
	VERSION: '1.0.0',

	API_VC: 1,
	API_GOODS: 2,
	API_CART: 3,

	CONTROLLER_PAYMENT_VIRTUAL_CURRENCY: 'ps',
	CONTROLLER_PAYMENT_DIGITAL_GOODS: 'subscription',
	CONTROLLER_PAYMENT_CART: 'cart',

	DEFAULT_SIGNATURE_VERSION: 3,
	SIGNATURE_VERSION_1: 1,
	SIGNATURE_VERSION_2: 2,
	SIGNATURE_VERSION_3: 3,

	errors: [],

	// static stuff
	apiType: null,
	appKey: null,
	secretKey: null,

	
	setApiType: function(apiType) {
		this.apiType = apiType;
	},

	getApiType: function() {
		return this.apiType;
	},

	setAppKey: function(appKey) {
		this.appKey = appKey;
	},

	getAppKey: function() {
		return this.appKey;
	},

	setSecretKey: function(secretKey) {
		this.secretKey = secretKey;
	},

	getSecretKey: function() {
		return this.secretKey;
	},

	appendToErrors: function(err) {
		return this.errors.push(err);
	},

	getErrors: function() {
		return this.errors;
	},

	getErrorSummary: function() {
		return this.getErrors().join("\n");
	},

	objectMerge: function(a, b) {
		for (var x in b) a[x] = b[x];
		return a;
	},

	extend: function(a) {
		return this.objectMerge(a, this);
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
	}
}

module.exports = PaymentwallBase;