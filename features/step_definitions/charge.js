
module.exports = function() {
  var token = '';
  var chargeId = '';
  var cvv = '432';
  var card;

  this.When(/^test token is retrieved$/, function (callback) {
    var onetimetoken = new this.paymentwall.Onetimetoken(
      4000000000000002,
      01,
      2017,
      cvv
    );
    onetimetoken.createOnetimetoken(function(brick_response){
      if(brick_response.isSuccessful()){
        if(brick_response.isActivated()){
          token = brick_response.getOnetimeToken();         //get onetimetoken
          card = brick_response.getCardInfo();              //get card information    
        }
      } else{
        error_code = brick_response.getErrorCode();
        error_details = brick_response.getErrorDetails();
      };

      token.should.be.a('String');
      card.should.be.a('Object');
      callback();
    });
  });

  this.Then(/^charge should be successful$/, function (callback) {
    var charge = new this.paymentwall.Charge(
      0.5,
      'USD',
      'description',
      'test@user.com',
      123,
      token,
      {'custom[aad]':'aa'}
    );

    charge.createCharge(function(brick_response){
      brick_response.should.be.a('Object');
      chargeId = brick_response.getChargeId();
      callback();
    });
  });

  this.Given(/^charge ID "([^"]*)"$/, function (arg1, callback) {
    callback();
  });

  this.Then(/^charge should be refunded$/, function (callback) {
    var charge = new this.paymentwall.Charge();

    charge.otherOperation(chargeId,'refund',function(brick_response){
      brick_response.should.be.a('Object');
      callback();
    });
  });

  this.Given(/^CVV code "([^"]*)"$/, function (arg1, callback) {
    cvv = arg1;
    callback();
  });

  this.Then(/^I see this error message "([^"]*)"$/, function (arg1, callback) {
    var charge = new this.paymentwall.Charge(
      0.5,
      'USD',
      'description',
      'test@user.com',
      123,
      token,
      {'custom[aad]':'aa'}
    );

    charge.createCharge(function(brick_response){
      var error_message = brick_response.getErrorDetails();
      error_message.should.be.equal(arg1);
      callback();
    });
  });
}