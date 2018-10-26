'use strict';

var HttpAction = require('./HttpAction'),
    ApiObject = require('./ApiObject'),
    util = require('util'),
    querystring = require('querystring');

function Subscription(amount,currency,description,email,fingerprint,token,period,period_duration,trial_data,extra){
  this.amount =  amount||null;
  this.currency = currency||'USD';
  this.description = description||null;
  this.email = email||null;
  this.fingerprint = fingerprint||null;
  this.token = token||null;
  this.period = period||null;
  this.period_duration = period_duration||null;
  this.trial_data = trial_data||null;
  this.extra = extra||null;
}

util.inherits(Subscription, ApiObject);

util._extend(Subscription.prototype, {

  createSubscription: function(callback){
    //set the post data
    var post_data = {
      'public_key': this.publickey,
      'amount': this.amount,
      'currency': this.currency,
      'description': this.description,
      'email': this.email,
      'fingerprint': this.fingerprint,
      'token': this.token,
      'period': this.period,
      'period_duration': this.period_duration
      };

    post_data = this.objectMerge(post_data, this.trial_data);
    post_data = this.objectMerge(post_data, this.extra);
    post_data = querystring.stringify(post_data);

    var post_options = this.createRequest('subscription');
    HttpAction.runAction(post_options, post_data, true, function(data){
      callback(data);
    });
  },


  otherOperation: function(subscriptionid,type,callback){
    var post_data = '';
    var additional_path;
    switch(type){
    case 'detail':  additional_path = '/'+subscriptionid;
                    break;
    case 'cancel':  additional_path = '/'+subscriptionid+'/cancel';
                    break;
    default: console.log('Parameter error in subscription.otherOperation');
                    break;
    }
    
    var post_options = this.createRequest('subscription', additional_path);
    HttpAction.runAction(post_options, post_data, true, function(data){
      callback(data);
    });

  }
});

module.exports = Subscription;