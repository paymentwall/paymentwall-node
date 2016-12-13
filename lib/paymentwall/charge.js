var Base = require('./base'),
    Product = require('./product'),
    util = require('util'),
    crypto = require('crypto');
    querystring = require('querystring');
    http = require('http');
    fs = require('fs');

function Charge(amount,currency,description,email,fingerprint,token,extra){
  this.url = 'api.paymentwall.com';
  this.path = '/api/brick/charge';
  this.method = 'Post';
  this.amount =  amount||null;
  this.currency = currency||'USD';
  this.description = description||null;
  this.email = email||null;
  this.fingerprint = fingerprint||null;
  this.token = token||null;
  this.extra = extra||null;
  this.publickey = this.getAppKey();
  this.secretkey = this.getSecretKey();
}

util.inherits(Charge, Base);

util._extend(Charge.prototype, {

  createCharge: function(callback){

    if (this.email==null||this.fingerprint==null) {
      console.log(this.email);
      console.log(this.fingerprint);
      console.log('Warning:email or fingerprint should not be null');
    };

    //set the post data
    var post_data = {
      'public_key': this.publickey,
      'amount': this.amount,
      'currency': this.currency,
      'description': this.description,
      'email': this.email,
      'fingerprint': this.fingerprint,
      'token': this.token
      };

    post_data = this.objectMerge(post_data, this.extra);
    post_data = querystring.stringify(post_data);

    // set the request options
    var post_options = {
        host: this.url,
        port: '80',
        path: this.path,
        'method': 'Post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ApiKey': this.secretkey
        }
    };

    console.log('Post_data for Charge:'+post_data);
    
    var post_req = http.request(post_options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('Response: ' + chunk);
              chunk = JSON.parse(chunk);
              callback(chunk);  
          });

    });
    post_req.write(post_data);
    post_req.end();
  },

  otherOperation: function(chargeid,type,callback){
    switch(type){
    case 'detail':  this.path = this.path+'/'+chargeid;
                    this.method='Get';
                    break;
    case 'refund':  this.path = this.path+'/'+chargeid+'/refund';
                    break;
    case 'capture': this.path = this.path+'/'+chargeid+'/capture';
                    break;
    case 'void':  this.path = this.path+'/'+chargeid+'/void';
                    break;
    default: console.log('parameter error in charge.otherOperation');
                    break;
    }

    var post_options = {
        host: this.url,
        port: '80',
        path: this.path,
        'method': this.method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ApiKey': this.secretkey
        }
    };
    var post_req = http.request(post_options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('Response: ' + chunk);
              chunk = JSON.parse(chunk);
              callback(chunk);  
          });
    });
    post_req.write('');
    post_req.end();
  }
});

module.exports = Charge;

