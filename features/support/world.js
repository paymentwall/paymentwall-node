var Paymentwall = require (process.cwd() + '/index.js');
	this.paymentwall = Paymentwall;

module.exports = function() {
	

	this.Given(/^Public key "([^"]*)"$/, function (arg1, callback) {
	  // Write code here that turns the phrase above into concrete actions
	  this.public_key = arg1;

	  callback(new Error(this.public_key));
	});

}