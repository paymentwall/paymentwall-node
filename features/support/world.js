var assert = require('assert');

module.exports = function() {
	this.Given(/^Public key "([^"]*)"$/, function (arg1, callback) {
	  // Write code here that turns the phrase above into concrete actions
	  this.paymentwall.Base.prototype.appKey = arg1;
	  callback();

	  //callback(new Error(this.paymentwall.Base.prototype.getAppKey()));
	});

	this.Given(/^Private key "([^"]*)"$/, function (arg1, callback) {
    	// Write code here that turns the phrase above into concrete actions
    	this.paymentwall.Base.prototype.secretKey = arg1;
    	callback();
  	});

  this.Given(/^Secret key "([^"]*)"$/, function (arg1, callback) {
      // Write code here that turns the phrase above into concrete actions
      this.paymentwall.Base.prototype.secretKey = arg1;
      callback();
    });

  	this.Given(/^API type "([^"]*)"$/, function (arg1, callback) {
    	this.paymentwall.Base.prototype.apiType = Number(arg1);
    	callback();
  	});

}