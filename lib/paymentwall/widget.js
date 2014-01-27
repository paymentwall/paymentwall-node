var PaymentwallBase = require('./Base.js');
var PaymentwallProduct = require('./Product.js');

var PaymentwallWidget = PaymentwallBase.extend({
	BASE_URL: 'https://api.paymentwall.com/api',
	userId: null,
	widgetCode: null,
	products: null,
	extraParams: null,

	initialize: function(userId, widgetCode, products, extraParams) {
		products = products || [];
		extraParams = extraParams || [];
		this.userId = userId;
		this.widgetCode = widgetCode;
		this.products = products;
		this.extraParams = extraParams;

		return this;
	},

	getDefaultSignatureVersion: function() {
		return this.getApiType() !== this.API_CART 
				? this.DEFAULT_SIGNATURE_VERSION 
				: this.SIGNATURE_VERSION_2;
	}, 

	getUrl: function() {
		var params = {
			'key': this.getAppKey(),
			'uid': this.userId,
			'widget': this.widgetCode
		};

		productsNumber = this.products.length;

		if (this.getApiType() === this.API_GOODS) {

			if (this.products) {

				if (productsNumber === 1) {

					var product = this.products[0];
					var postTrialProduct = null;

					// most likely issue!
					//if (typeof product.getTrialProduct() === PaymentwallProduct) {
					if (product.getTrialProduct()) {
						postTrialProduct = product;
						product = product.getTrialProduct();
					}

					params['amount'] = product.getAmount();
					params['currencyCode'] = product.getCurrencyCode();
					params['ag_name'] = product.getName();
					params['ag_external_id'] = product.getId();
					params['ag_type'] = product.getType();

					if (product.getType() === PaymentwallProduct.TYPE_SUBSCRIPTION) {

						params['ag_period_length'] = product.getPeriodLength();
						params['ag_period_type'] = product.getPeriodType();

						if (product.isRecurring()) {

							params['ag_recurring'] = product.isRecurring() ? 1 : 0;

							if (postTrialProduct !== null) {
								params['ag_trial'] = 1;
								params['ag_post_trial_external_id'] = postTrialProduct.getId();
								params['ag_post_trial_period_length'] = postTrialProduct.getPeriodLength();
								params['ag_post_trial_period_type'] = postTrialProduct.getPeriodType();
								params['ag_post_trial_name'] = postTrialProduct.getName();
								params['post_trial_amount'] = postTrialProduct.getAmount();
								params['post_trial_currencyCode'] = postTrialProduct.getCurrencyCode();
							}

						}
					}

				} else {
					//TODO: this.appendToErrors('Only 1 product is allowed in flexible widget call');
				}

			}

		} else if (this.getApiType() === this.API_CART) {

			index = 0;
			this.products.forEach(function(product) {
				params['external_ids[' + index + ']'] = product.getId();

				if (isset(product.amount)) {
					params['prices[' + index + ']'] = product.getAmount();
				}
				if (isset(product.currencyCode)) {
					params['currencies[' + index + ']'] = product.getCurrencyCode();
				}

				index++;
			});
			unset(index);
		}

		params['sign_version'] = signatureVersion = this.getDefaultSignatureVersion();

		if (this.extraParams['sign_version']) {
			signatureVersion = params['sign_version'] = this.extraParams['sign_version'];
		}

		params = this.objectMerge(params, this.extraParams);

		params['sign'] = this.calculateSignature(params, this.getSecretKey(), signatureVersion);

		var querystring = require("querystring");

		return this.BASE_URL + '/' + this.buildController(this.widgetCode) + '?' + querystring.stringify(params);
	},

	getHtmlCode: function(attributes) {

		attributes = attributes || {};

		defaultAttributes = {
			'frameborder': '0',
			'width': '750',
			'height': '800'
		};

		attributes = this.objectMerge(defaultAttributes, attributes);

		attributesQuery = '';
		for (var attr in attributes) {
			attributesQuery += ' ' + attr + '="' + attributes[attr] + '"';
		}

		return '<iframe src="' + this.getUrl() + '"' + attributesQuery + '></iframe>';

	},

	buildController: function(widget, flexibleCall) {

		flexibleCall = flexibleCall || false;

		if (this.getApiType() === this.API_VC) {

			if (!widget.match(/^w|s|mw/)) {
				return this.CONTROLLER_PAYMENT_VIRTUAL_CURRENCY;
			}

		} else if (this.getApiType() === this.API_GOODS) {

			if (!flexibleCall) {
				if (!widget.match(/^w|s|mw/)) {
					return this.CONTROLLER_PAYMENT_DIGITAL_GOODS;
				}
			} else {
				return this.CONTROLLER_PAYMENT_DIGITAL_GOODS;
			}

		} else {

			return this.CONTROLLER_PAYMENT_CART;

		}
	},

	calculateSignature: function(params, secret, version)
	{
		var crypto = require('crypto');
		var baseString = '';

		if (version === this.SIGNATURE_VERSION_1) {
			// TODO: throw exception if no uid parameter is present

			baseString += params['uid'] || '';
			baseString += secret;

			return crypto.createHash('md5').update(baseString).digest('hex');

		} else {

			if (params instanceof Object) {
				params = this.sortObject(params);
				for (p in params){
					if (p instanceof Object) {
						p = this.sortObject(p);
					}
				}
			}

			for (key in params) {
				var value = params[key];
				if (value instanceof Object) {
					for (k in value) {
						var v = value[k];
						baseString += key + '[' + k + ']' + '=' + v;
					}
				} else {
					baseString += key + '=' + value;
				}
			}

			baseString += secret;
			
			var algorithm = (version === this.SIGNATURE_VERSION_2) 
				? 'md5'
				: 'sha256';

			var shasum = crypto.createHash(algorithm).update(baseString);

			return shasum.digest('hex');
		}
	}
});

module.exports = PaymentwallWidget;