var PaymentwallBase = require('./Base.js');

var PaymentwallPingback = PaymentwallBase.extend({
	PINGBACK_TYPE_REGULAR: 0,
	PINGBACK_TYPE_GOODWILL: 1,
	PINGBACK_TYPE_NEGATIVE: 2,

	parameters: null,
	ipAddress: null,

	initialize: function(parameters, ipAddress) {

		this.parameters = parameters;
		this.ipAddress = ipAddress;

		return this;
	},

	validate: function(skipIpWhitelistCheck) {

		skipIpWhitelistCheck = skipIpWhitelistCheck || false;

		validated = false;

		if (this.isParametersValid()) {

			if (this.isIpAddressValid() || skipIpWhitelistCheck) {

				if (this.isSignatureValid()) {

					validated = true;

				} else {
					this.appendToErrors('Wrong signature');
				}

			} else {
				this.appendToErrors('IP address is not whitelisted');
			}

		} else {
			this.appendToErrors('Missing parameters');
		}

		return validated;
	},

	isSignatureValid: function() {

		var signatureParamsToSign = {};

		if (this.getApiType() === this.API_VC) {

			signatureParams = ['uid', 'currency', 'type', 'ref'];

		} else if (this.getApiType() === this.API_GOODS) {

			signatureParams = ['uid', 'goodsid', 'slength', 'speriod', 'type', 'ref'];

		} else { // API_CART

			signatureParams = ['uid', 'goodsid', 'type', 'ref'];

			this.parameters['sign_version'] = this.SIGNATURE_VERSION_2;

		}

		if (!this.parameters['sign_version'] || this.parameters['sign_version'] === this.SIGNATURE_VERSION_1) {

			var ref = this;
			signatureParams.forEach(function(field) {
				signatureParamsToSign[field] = (ref.parameters[field] !== undefined) ? ref.parameters[field] : null;
			});

			this.parameters['sign_version'] = this.SIGNATURE_VERSION_1;

		} else {
			signatureParamsToSign = this.parameters;
		}

		signatureCalculated = this.calculateSignature(signatureParamsToSign, this.getSecretKey(), this.parameters['sign_version']);

		signature = (this.parameters['sig'] !== undefined) ? this.parameters['sig'] : null;

		return signature === signatureCalculated;
	},

	isIpAddressValid: function() {
		ipsWhitelist = [
			'174.36.92.186',
			'174.36.96.66',
			'174.36.92.187',
			'174.36.92.192',
			'174.37.14.28'
		];

		return ipsWhitelist.indexOf(this.ipAddress) >= 0;
	}, 

	isParametersValid: function() {
		errorsNumber = 0;

		if (this.getApiType() === this.API_VC) {

			requiredParams = ['uid', 'currency', 'type', 'ref', 'sig'];

		} else if (this.getApiType() === this.API_GOODS) {

			requiredParams = ['uid', 'goodsid', 'type', 'ref', 'sig'];

		} else { // Cart API

			requiredParams = ['uid', 'goodsid', 'type', 'ref', 'sig'];

		}

		var ref = this;

		requiredParams.forEach(function(field) {
			if ((ref.parameters[field] === undefined) || ref.parameters[field] === '') {
				ref.appendToErrors('Parameter ' + field + ' is missing');
				errorsNumber++;
			}
		});

		return errorsNumber === 0;
	},

	getParameter: function(param) {
		if (this.parameters[param] !== undefined) {
			return this.parameters[param];
		}
	},

	getType: function() {
		pingbackTypes = [
			this.PINGBACK_TYPE_REGULAR,
			this.PINGBACK_TYPE_GOODWILL,
			this.PINGBACK_TYPE_NEGATIVE
		];

		if (this.parameters['type']) {
			this.parameters['type'] = parseInt(this.parameters['type']);
			if (pingbackTypes.indexOf(this.parameters['type']) >= 0) {
				return this.parameters['type'];
			}
		}
	}, 

	getUserId: function(){
		return this.getParameter('uid');
	},

	getVirtualCurrencyAmount: function() {
		return this.getParameter('currency');
	}, 

	getProductId: function() {
		return this.getParameter('goodsid');
	},

	getProductPeriodLength: function() {
		return this.getParameter('slength');
	},

	getProductPeriodType: function() {
		return this.getParameter('speriod');
	},

	getProduct: function() {
		var PaymentwallProduct = require('./Product.js');

		return PaymentwallProduct.initialize(
			this.getProductId(),
			0,
			null,
			null,
			this.getProductPeriodLength() > 0 ? PaymentwallProduct.TYPE_SUBSCRIPTION : PaymentwallProduct.TYPE_FIXED,
			this.getProductPeriodLength(),
			this.getProductPeriodType()
		);
	},

	getProducts: function() {
		var PaymentwallProduct = require('./Product.js');

		result = [];
		productIds = this.getParameter('goodsid');

		if (productIds && productIds instanceof Array) {
			productIds.forEach(function(id) {
				result.push(PaymentwallProduct.initialize(id));
			});
		}

		return result;
	},

	getReferenceId: function() {
		return this.getParameter('ref');
	},

	getPingbackUniqueId: function() {
		return this.getReferenceId() + '_' + this.getType();
	},

	isDeliverable: function() {
		return (this.getType() === this.PINGBACK_TYPE_REGULAR || this.getType() === this.PINGBACK_TYPE_GOODWILL);
	},

	isCancelable: function() {
		return this.getType() === this.PINGBACK_TYPE_NEGATIVE;
	},

	calculateSignature: function(params, secret, version) {
		baseString = '';

		version = parseInt(version);

		if (version !== this.SIGNATURE_VERSION_1) {
			if (params instanceof Object) {
				params = this.sortObject(params);	
				for (key in params) {
					if (params[key] instanceof Object) {
						params[key] = this.sortObject(params[key]);	
					}
				}
			}
		}

		for (key in params) {
			if (key === 'sig') {
				continue;
			}
			var value = params[key];
			if (value instanceof Object) {
				for (k in value) {
					var v = value[k];
					if (v !== undefined) {
						baseString += key + '[' + k + ']' + '=' + v;
					}
				}
			} else {
				if (value !== undefined) {
					baseString += key + '=' + value;
				}
			}
		}

		baseString += secret;

		var crypto = require('crypto');
		var algorithm = (version === this.SIGNATURE_VERSION_3) 
				? 'sha256'
				: 'md5';

		var shasum = crypto.createHash(algorithm).update(baseString);

		return shasum.digest('hex');
	}
});

module.exports = PaymentwallPingback;