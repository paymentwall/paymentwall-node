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
    // Write code here that turns the phrase above into concrete actions
    widgetSignatureVersion = arg1;
    callback();
  });

  this.Given(/^Product name "([^"]*)"$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
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

  	if (widgetCode.length > 0) {
  		extra['widget'] = widgetCode;
  	}

    // Write code here that turns the phrase above into concrete actions
    widget = new this.paymentwall.Widget(
	  'test_user',      // id of the end-user who's making the payment
	  widgetCode,            // widget code, e.g. p1; can be picked in the Widgets section of your merchant account 
	  [                 // product details for Flexible Widget Call. 
	                    // Leave empty if product selection happens on Paymentwall's side
	    new this.paymentwall.Product(
	      'product301',                           // id of the product in your system  
	      9.99,                                   // price
	      'USD',                                  // currency code
	      productName                // product name
	    )
	  ],
	  extra	               // additional parameters. for full list check API docs
	);
	
    callback();
  });

  this.When(/^Widget HTML content is loaded$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
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
    // Write code here that turns the phrase above into concrete actions
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
    // Write code here that turns the phrase above into concrete actions
    if (widget.getUrl().search(arg1) !== -1) {
    	callback();
    } else {
    	callback(new Error(arg1 + " not found in URL"));
    }
  });
}