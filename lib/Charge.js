'use strict';

var HttpAction = require('./HttpAction'),
    ApiObject = require('./ApiObject'),
    inherits = require('inherits'),
    querystring = require('querystring');

function Charge(amount,currency,description,email,fingerprint,token,extra){
  this.amount =  amount||null;
  this.currency = currency||'USD';
  this.description = description||null;
  this.email = email||null;
  this.fingerprint = fingerprint||null;
  this.token = token||null;
  this.extra = extra||null;
}

inherits(Charge, ApiObject);

Object.assign(Charge.prototype, {

  createCharge: function(callback){
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

    var post_options = this.createRequest('charge');
    HttpAction.runAction(post_options, post_data, true, function(response){
      callback(response);
    });

  },

  otherOperation: function(chargeid,type,callback){
    var post_data = '';
    var additional_path;
    switch(type){
    case 'detail':  additional_path = '/'+chargeid;
                    break;
    case 'refund':  additional_path = '/'+chargeid+'/refund';
                    break;
    case 'capture': additional_path = '/'+chargeid+'/capture';
                    break;
    case 'void':  additional_path = '/'+chargeid+'/void';
                    break;
    default: console.log('Parameter error in charge.otherOperation');
                    break;
    }

    var post_options = this.createRequest('charge', additional_path);
    HttpAction.runAction(post_options, post_data, true, function(data){
      callback(data);
    });

  }
});

module.exports = Charge;

