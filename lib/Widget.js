'use strict';

var Base = require('./base'),
	Product = require('./product'),
	util = require('util'),
	querystring = require('querystring'),
	Signature = require('./Signature/Widget');

function Widget(userId, widgetCode, products, extraParams) {
	this.errors = []
	this.userId = userId || null;
	this.widgetCode = widgetCode || null;
	this.products = products || null;
	this.extraParams = extraParams || null;
}

util.inherits(Widget, Base);
util._extend(Widget.prototype, {

	getDefaultWidgetSignature: function() {
		return this.getApiType() !== this.API_CART ? this.DEFAULT_SIGNATURE_VERSION : this.SIGNATURE_VERSION_2;
	},

	getUrl: function() {
		var params = {
			'key': this.getAppKey(),
			'uid': this.userId,
			'widget': this.widgetCode
		};

		var productsNumber = this.products.length;

		if (this.getApiType() === this.API_GOODS) {
			if (this.products) {
				if (productsNumber === 1) {	

					var product = this.products[0];
					var postTrialProduct = null;
					if (product.getTrialProduct()) {
						postTrialProduct = product;
						product = product.getTrialProduct();
					}

					params['amount'] = product.getAmount();
					params['currencyCode'] = product.getCurrencyCode();
					params['ag_name'] = product.getName();
					params['ag_external_id'] = product.getId();
					params['ag_type'] = product.getType();
					
					if (product.getType() === Product.TYPE_SUBSCRIPTION) {

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
			var index = 0;

			this.products.forEach(function(product) {
				params['external_ids[' + index + ']'] = product.getId();

				if (product.amount > 0) {
					params['prices[' + index + ']'] = product.getAmount();
				}
				if (product.currencyCode) {
					params['currencies[' + index + ']'] = product.getCurrencyCode();
				}
				index++;
			});
		}

		var signatureVersion;
		params['sign_version'] = signatureVersion = this.getDefaultWidgetSignature();

		if (this.extraParams&&this.extraParams['sign_version']) {
			signatureVersion = params['sign_version'] = this.extraParams['sign_version'];
		}

		params = this.objectMerge(params, this.extraParams);

		params['sign'] = Signature.calculateSignature(params, this.getSecretKey(), signatureVersion);

		return this.WIDGET_BASE_URL + '/' + this.buildController(this.widgetCode) + '?' + querystring.stringify(params);
	},

	getHtmlCode: function(attributes) {
		var attributes = attributes || {};

		var defaultAttributes = {
			'frameborder': '0',
			'width': '750',
			'height': '800'
		};

		attributes = this.objectMerge(defaultAttributes, attributes);

		var attributesQuery = '';
		for (var attr in attributes) {
			attributesQuery += ' ' + attr + '="' + attributes[attr] + '"';
		}

		return '<iframe src="' + this.getUrl() + '"' + attributesQuery + '></iframe>';
	},

	buildController: function(widget, flexibleCall) {
		var flexibleCall = flexibleCall || false;
		var pattern = /^w|s|mw/;

		if (this.getApiType() == this.API_VC) {
			if (!widget.match(pattern)) {
				return this.VC_CONTROLLER;
			}
		} else if (this.getApiType() === this.API_GOODS) {
			if (!flexibleCall && !widget.match(pattern)) {
				return this.GOODS_CONTROLLER;
			}
		} else {
			return this.CART_CONTROLLER;
		}

		return '';
	},

});

module.exports = Widget;
