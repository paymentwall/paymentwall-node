

module.exports = function() {
  // this.Given(/^Public key "([^"]*)"$/, function (arg1, callback) {
  //   // Write code here that turns the phrase above into concrete actions
  //   this.public_key = arg1;
  //   callback();
  // });

  this.Given(/^Private key "([^"]*)"$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback();
  });

  this.When(/^test token is retrieved$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^charge should be successful$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^charge ID "([^"]*)"$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^charge should be refunded$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^CVV code "([^"]*)"$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^I see this error message "([^"]*)"$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });
}