'use strict';

var inherits = require('inherits');
var Config = require('./Config');

Base.API_VC = 1;
Base.API_GOODS = 2;
Base.API_CART = 3;

function Base() {
}

inherits(Base, Config);

Object.assign(Base.prototype, {

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

	appendToErrors: function(err) {
		return this.errors.push(err);
	},

	getErrors: function() {
		return this.errors;
	},

	getErrorSummary: function() {
		return this.getErrors().join("\n");
	}
});
module.exports = Base;
