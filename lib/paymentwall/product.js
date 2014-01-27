Product.TYPE_SUBSCRIPTION = 'subscription';
Product.TYPE_FIXED = 'fixed';

Product.PERIOD_TYPE_DAY = 'day';
Product.PERIOD_TYPE_WEEK = 'week';
Product.PERIOD_TYPE_MONTH = 'month';
Product.PERIOD_TYPE_YEAR = 'year';

function Product(productId, amount, currencyCode, name, productType, periodLength, periodType, recurring, trialProduct) {
	this.productId = productId;
	this.amount = (amount || 0.00).toFixed(2);
	this.currencyCode = currencyCode || null;
	this.name = name || null;
	this.productType = productType || Product.TYPE_FIXED;
	this.periodLength = periodLength || 0;
	this.periodType = periodType || null;
	this.recurring = recurring || false;
	if (productType === Product.TYPE_SUBSCRIPTION && recurring && recurring !== 0) {
		this.trialProduct = trialProduct || null;
	}
}

Product.prototype = {
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
		return this.recurring;
	},

	getTrialProduct: function() {
		return this.trialProduct;
	}
};

module.exports = Product;