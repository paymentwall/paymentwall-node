

module.exports = function() {

  this.Given(/^Pingback GET parameters "([^"]*)"$/, function (arg1, callback) {
    this.queryData = arg1;
    callback();
  });

  this.Given(/^Pingback IP address "([^"]*)"$/, function (arg1, callback) {
    this.ipAddress = arg1;
    callback();
  });

  this.When(/^Pingback is constructed$/, function (callback) {
    this.pingback = new this.paymentwall.Pingback(this.queryData, this.ipAddress);
    callback();
  });

  this.Then(/^Pingback validation result should be "([^"]*)"$/, function (arg1, callback) {
    this.pingback.validate().toString().should.equal(arg1);
    callback();
  });

  this.Then(/^Pingback method "([^"]*)" should return "([^"]*)"$/, function (arg1, arg2, callback) {
    r = this.pingback[arg1]();
    r.toString().should.equal(arg2);
    callback();
  });
  
}