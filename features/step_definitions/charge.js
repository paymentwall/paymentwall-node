
module.exports = function() {
  var token = '';
  var chargeId = '';
  var cvv = '432';

  this.When(/^test token is retrieved$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions

    var onetimetoken = new this.paymentwall.Onetimetoken(
      4000000000000002,// Card number, digits only
      01,// Expiration month, 2 digits from 01 to 12
      2017,// Expiration year, 4 digits
      cvv// CVC/CVV, 3-4 digits
    );

      onetimetoken.createOnetimetoken(function(onetimetoken_response){
        // get the parameter in response
        onetimetoken_response.token.should.be.a('string');
        token = onetimetoken_response.token;
        callback();
      });
  });

  this.Then(/^charge should be successful$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    var charge = new this.paymentwall.Charge(
      0.5,
      'USD',
      'description',
      'test@user.com',
      123,
      token,
      {'custom[aad]':'aa'} //custom parameters
    );

    charge.createCharge(function(Charge_response){
      // get the parameter in response
      Charge_response.should.be.a('Object');
      chargeId = Charge_response.id;
      callback();
    });
  });

  this.Given(/^charge ID "([^"]*)"$/, function (arg1, callback) {
    // chargeId = arg1;
    callback();
  });

  this.Then(/^charge should be refunded$/, function (callback) {

    var charge = new this.paymentwall.Charge();

    charge.otherOperation(chargeId,'refund',function(refundData){
      refundData.should.be.a('Object');
      callback();
    });

  });

  this.Given(/^CVV code "([^"]*)"$/, function (arg1, callback) {
    cvv = arg1;
    callback();
  });

  this.Then(/^I see this error message "([^"]*)"$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    var charge = new this.paymentwall.Charge(
      0.5,
      'USD',
      'description',
      'test@user.com',
      123,
      token,
      {'custom[aad]':'aa'} //custom parameters
    );

    charge.createCharge(function(Charge_response){
      // get the parameter in response
      Charge_response.error.should.be.equal('Please contact your credit card company to approve your payment')
      callback();
    });
  });
}