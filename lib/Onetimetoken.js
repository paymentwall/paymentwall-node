'use strict';

var ApiObject = require('./ApiObject'),
	Card = require('./Card'),
	HttpAction = require('./HttpAction'),
	util = require('util'),
	querystring = require('querystring');

function Onetimetoken(number,exp_month,exp_year,cvv){
	this.card = new Card(number,exp_month,exp_year,cvv);
}

util.inherits(Onetimetoken, ApiObject);

util._extend(Onetimetoken.prototype, {
	
	createOnetimetoken: function(callback){
		//set the post data
		var post_data = {
			'public_key': this.appKey,
			'card[number]': this.card.number,
			'card[exp_month]': this.card.exp_month,
			'card[exp_year]': this.card.exp_year,
			'card[cvv]': this.card.cvv
		};
		post_data = querystring.stringify(post_data);
		var post_options = this.createRequest('onetimetoken');
		HttpAction.runAction(post_options, post_data, true, function(data){
			callback(data);
		});
	}

});


module.exports = Onetimetoken;




