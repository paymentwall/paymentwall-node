'use strict';

var Base = require('./Base'),
	Product = require('./Product'),
	inherits = require('inherits'),
	Signature = require('./Signature/Pingback'),
	querystring = require('querystring');

Pingback.PINGBACK_TYPE_REGULAR = 0;
Pingback.PINGBACK_TYPE_GOODWILL = 1;
Pingback.PINGBACK_TYPE_NEGATIVE = 2;

function Pingback(parameters, ipAddress, pingbackForBrick) {
	this.errors = [];
	if(typeof(parameters) === "string"){
		parameters = querystring.parse(parameters);
	} else if(parameters instanceof Object){

	} else {
		console.log("Error: Please pass Object as the queryData in Paymentwall.Pingback(queryData, ip)");
	}

	this.parameters = parameters;
	this.ipAddress = ipAddress;
	this.pingbackForBrick = pingbackForBrick||false;
}

inherits(Pingback, Base);

Object.assign(Pingback.prototype, {

	validate: function(skipIpWhitelistCheck) {
		var pingbackForBrick = this.pingbackForBrick;
		var skipIpWhitelistCheck = skipIpWhitelistCheck || false;
		var validated = false;

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
		var signatureParams = [];
		if (this.getApiType() === this.API_VC) {
			signatureParams = ['uid', 'currency', 'type', 'ref'];
		} else if (this.getApiType() === this.API_GOODS) {
			if (!this.pingbackForBrick) {
				signatureParams = ['uid', 'goodsid', 'slength', 'speriod', 'type', 'ref'];
			} else{
				signatureParams = ['uid', 'slength', 'speriod', 'type', 'ref'];
			}
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

		var signatureCalculated = Signature.calculateSignature(signatureParamsToSign, this.getSecretKey(), this.parameters['sign_version']);
		var signaturePassed = (this.parameters['sig'] !== undefined) ? this.parameters['sig'] : null;
		return signaturePassed === signatureCalculated;
	},

	isIpAddressValid: function() {
		var ipsWhitelist = [
			'174.36.92.186',
			'174.36.96.66',
			'174.36.92.187',
			'174.36.92.192',
			'174.37.14.28'
		];

		return ipsWhitelist.indexOf(this.ipAddress) >= 0;
	},

	isParametersValid: function() {

		var errorsNumber = 0;
		var requiredParams = [];
		if (this.getApiType() === this.API_VC) {
			requiredParams = ['uid', 'currency', 'type', 'ref', 'sig'];
		} else if (this.getApiType() === this.API_GOODS) {
			if (!this.pingbackForBrick) {
				requiredParams = ['uid', 'goodsid', 'type', 'ref', 'sig'];
			} else{
				requiredParams = ['uid', 'type', 'ref', 'sig'];
			}
		} else { // Cart API
			requiredParams = ['uid', 'goodsid', 'type', 'ref', 'sig'];
		}

		var ref = this;

		if (typeof ref.parameters !== 'object') {
			ref.parameters = querystring.parse(ref.parameters);}

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
		var type;
		var pingbackTypes = [
			Pingback.PINGBACK_TYPE_REGULAR,
			Pingback.PINGBACK_TYPE_GOODWILL,
			Pingback.PINGBACK_TYPE_NEGATIVE
		];

		if (this.parameters['type']) {
			type = parseInt(this.parameters['type']);
			if (pingbackTypes.indexOf(type) >= 0) {
				return type;
			}
		}
	},

	getUserId: function() {
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

	getReferenceId: function() {
		return this.getParameter('ref');
	},

	getPingbackUniqueId: function() {
		return this.getReferenceId() + '_' + this.getType();
	},

	getProduct: function() {
		return new Product(
			this.getProductId(),
			0,
			null,
			null,
			this.getProductPeriodLength() > 0 ? Product.TYPE_SUBSCRIPTION : Product.TYPE_FIXED,
			this.getProductPeriodLength(),
			this.getProductPeriodType()
		);
	},

	getProducts: function() {
		var result = [];
		var productIds = this.getParameter('goodsid');

		if (productIds && productIds instanceof Array) {
			productIds.forEach(function(id) {
				result.push(new Product(id));
			});
		}
		return result;
	},

	isDeliverable: function() {
		return (this.getType() === Pingback.PINGBACK_TYPE_REGULAR || this.getType() === Pingback.PINGBACK_TYPE_GOODWILL);
	},

	isCancelable: function() {
		return this.getType() === Pingback.PINGBACK_TYPE_NEGATIVE;
	},

});

module.exports = Pingback;
