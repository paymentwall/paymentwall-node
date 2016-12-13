var Base = require('./base'),
	Product = require('./product'),
	util = require('util'),
	crypto = require('crypto');
	querystring = require('querystring');
	http = require('http');
	fs = require('fs');

function Onetimetoken(card_number,card_exp_month,card_exp_year,card_cvv){
	this.card={
		number: card_number || null,
		card_exp_month: card_exp_month || null,
		card_exp_year: card_exp_year || null,
		card_cvv: card_cvv || null
	}
	this.url = 'pwgateway.com';
	this.path = '/api/token';
	this.reg = /_+/;
	this.publickey = this.getAppKey();
	this.secretkey = this.getSecretKey();
}

util.inherits(Onetimetoken, Base);

util._extend(Onetimetoken.prototype, {

	createOnetimetoken: function(callback){
	    var prefix_result = this.reg.test(this.secretkey); 
	    //set the post data
		var post_data = {
			'public_key': this.publickey,
			'card[number]': this.card.number,
			'card[exp_month]': this.card.card_exp_month,
			'card[exp_year]': this.card.card_exp_year,
			'card[cvv]': this.card.card_cvv
			};
		post_data = querystring.stringify(post_data);
		console.log('Post_data for Onetimetoken:'+post_data);
		//set the URL and path
		if (prefix_result==true) {
			this.url = 'api.paymentwall.com';
			this.path = '/api/brick/token';
		};

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
		var post_req = http.request(post_options, function(res) {
			    res.setEncoding('utf8');
			    res.on('data', function (onetimetoken_data) {
			        console.log('Response: ' + onetimetoken_data);
					onetimetoken_data = JSON.parse(onetimetoken_data);
					callback(onetimetoken_data);			        
			    });

		});
		post_req.write(post_data);
		post_req.end();
	}
});


module.exports = Onetimetoken;




