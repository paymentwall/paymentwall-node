module.exports = function() {
  this.Before(function(scenario,callback) {
    require('chai').should();
    this.expect = require('chai').expect;
    var Paymentwall = require (process.cwd() + '/index');

    Paymentwall.configure(
      null,
      null,
      null
    );

    this.paymentwall = Paymentwall;
    callback();
  });
}