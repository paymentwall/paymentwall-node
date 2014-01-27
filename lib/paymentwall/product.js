var PaymentwallProduct = {

	TYPE_SUBSCRIPTION: 'subscription',
	TYPE_FIXED: 'fixed',

	PERIOD_TYPE_DAY: 'day',
	PERIOD_TYPE_WEEK: 'week',
	PERIOD_TYPE_MONTH: 'month',
	PERIOD_TYPE_YEAR: 'year',

	initialize: function(productId, amount, currencyCode, name, productType, periodLength, periodType, recurring, trialProduct) {

		ref = this.clone();

		amount = amount || 0.00;
		currencyCode = currencyCode || null;
		name = name || null;
		productType = productType || ref.TYPE_FIXED;
		periodLength = periodLength || 0;
		periodType = periodType || null;
		recurring = recurring || false;
		trialProduct = trialProduct || null;

		ref.productId = productId;
		ref.amount = amount.toFixed(2);
		ref.currencyCode = currencyCode;
		ref.name = name;
		ref.productType = productType;
		ref.periodLength = periodLength;
		ref.periodType = periodType;
		ref.reccuring = recurring;
		if (productType == PaymentwallProduct.TYPE_SUBSCRIPTION && recurring) {
			ref.trialProduct = trialProduct;
		}
		return ref;
	},
 
	getId: function() {
		return this.productId;
	},

	getAmount: function() {
		return this.amount;
	},

	getCurrencyCode: function() {
		return this.currencyCode;
	},

	getName: function() {
		return this.name;
	},

	getType: function() {
		return this.productType;
	},

	getPeriodType: function() {
		return this.periodType;
	},

	getPeriodLength: function() {
		return this.periodLength;
	},

	isRecurring: function() {
		return this.reccuring;
	},

	getTrialProduct: function() {
		return this.trialProduct;
	},

	clone: function() {
		var clone = {};
		for (key in this) {
			clone[key] = this[key];
		}
		return clone;
	}
}

module.exports = PaymentwallProduct;