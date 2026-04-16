'use strict';

const cheerio = require('cheerio');

module.exports = function() {
  let widgetSignatureVersion = '';
  let productName            = '';
  let widget                 = '';
  let htmlBody               = '';
  let widgetCode             = 'p10';
  let languageCode           = '';

  this.Given(/^Widget signature version "([^"]*)"$/, function(arg1, callback) {
    widgetSignatureVersion = arg1;
    callback();
  });

  this.Given(/^Product name "([^"]*)"$/, function(arg1, callback) {
    productName = arg1;
    callback();
  });

  this.When(/^Widget is constructed$/, function(callback) {
    const extra = {
      email        : 'user@hostname.com',
      sign_version : widgetSignatureVersion,
      ...(languageCode && { lang: languageCode })
    };

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

  this.When(/^Widget HTML content is loaded$/, function(callback) {
    fetch(widget.getUrl())
      .then(response => response.text())
      .then(body => {
        htmlBody = body;
        callback();
      })
      .catch(err => callback(err));
  });

  this.Then(/^Widget HTML content should not contain "([^"]*)"$/, function(expected, callback) {
    const $ = cheerio.load(htmlBody);
    const bodyText = $('html > body').text().toLowerCase();

    if (!bodyText.includes(expected.toLowerCase())) {
      callback();
    } else {
      callback(new Error(`"${expected}" found in HTML`));
    }
  });

  this.Then(/^Widget HTML content should contain "([^"]*)"$/, function(expected, callback) {
    const $ = cheerio.load(htmlBody);
    const bodyText = $('html > body, h2').text().toLowerCase();

    if (bodyText.includes(expected.toLowerCase())) {
      callback();
    } else {
      callback(new Error(`"${expected}" not found in HTML`));
    }
  });

  this.Given(/^Widget code "([^"]*)"$/, function(arg1, callback) {
    widgetCode = arg1;
    callback();
  });

  this.Given(/^Language code "([^"]*)"$/, function(arg1, callback) {
    languageCode = arg1;
    callback();
  });

  this.Then(/^Widget URL should contain "([^"]*)"$/, function(expected, callback) {
    if (widget.getUrl().includes(expected)) {
      callback();
    } else {
      callback(new Error(`"${expected}" not found in URL`));
    }
  });
};
