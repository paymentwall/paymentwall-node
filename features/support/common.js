var assert = require('assert');

module.exports = function() {
  this.Given(/^Public key "([^"]*)"$/, function (arg1, callback) {
    this.paymentwall.Configure.prototype.appKey = arg1;
    callback();
  });

  this.Given(/^Private key "([^"]*)"$/, function (arg1, callback) {
    this.paymentwall.Configure.prototype.secretKey = arg1;
    callback();
  });

  this.Given(/^Secret key "([^"]*)"$/, function (arg1, callback) {
    this.paymentwall.Configure.prototype.secretKey = arg1;
    callback();
  });

  this.Given(/^API type "([^"]*)"$/, function (arg1, callback) {
   	this.paymentwall.Configure.prototype.apiType = Number(arg1);
   	callback();
  });
}