var request = require('request');
var cheerio = require('cheerio');

module.exports = function() {
  var widgetSignatureVersion = '';
  var productName = '';
  var widget = ''
  var htmlBody = '';
  var widgetCode = 'p10';
  var languageCode = '';

  this.Given(/^Widget signature version "([^"]*)"$/, function (arg1, callback) {
    widgetSignatureVersion = arg1;
    callback();
  });

  this.Given(/^Product name "([^"]*)"$/, function (arg1, callback) {
    productName = arg1;
    callback();
  });

  this.When(/^Widget is constructed$/, function (callback) {
    var extra = {
      'email': 'user@hostname.com',
      'sign_version': widgetSignatureVersion
    };

    if (languageCode.length > 0) {
      extra['lang'] = languageCode;
    }

    widget = new this.paymentwall.Widget(
      'test_user',
      widgetCode,
      [
        new this.paymentwall.Product(
          'product301',
          9.99,
          'USD',
          productName
        )
      ],
      extra
    );

    callback();
  });

  this.When(/^Widget HTML content is loaded$/, function (callback) {
    request(widget.getUrl(), function(err, resp, body) {
      if (err)
        throw err;
      htmlBody = body;

      callback();
    });
  });

  this.Then(/^Widget HTML content should not contain "([^"]*)"$/, function (arg1, callback) {
    $ = cheerio.load(htmlBody);
    var bodyText = $('html > body').text();

    if (bodyText.toLowerCase().indexOf(arg1.toLowerCase()) == -1) {
      callback();
    } else {
      callback(new Error(arg1 + "found in HTML"));
    }
  });

  this.Then(/^Widget HTML content should contain "([^"]*)"$/, function (arg1, callback) {
    $ = cheerio.load(htmlBody);
    var bodyText = $('html > body, h2').text();
    if (bodyText.toLowerCase().indexOf(arg1.toLowerCase()) !== -1) {
      callback();
    } else {
      callback(new Error(arg1 + " not found in HTML"));
    }
  });

  this.Given(/^Widget code "([^"]*)"$/, function (arg1, callback) {
    widgetCode = arg1;
    callback();
  });

  this.Given(/^Language code "([^"]*)"$/, function (arg1, callback) {
    languageCode = arg1;
    callback();
  });

  this.Then(/^Widget URL should contain "([^"]*)"$/, function (arg1, callback) {
    if (widget.getUrl().search(arg1) !== -1) {
      callback();
    } else {
      callback(new Error(arg1 + " not found in URL"));
    }
  });
}