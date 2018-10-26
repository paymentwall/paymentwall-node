'use strict';

var Base = require('./Base'),
	util = require('util'),
	querystring = require('querystring');

function ApiObject() {
}

util.inherits(ApiObject, Base);

util._extend(ApiObject.prototype, {

	checkProjectEnv: function(){
		var reg = /_+/;
		return reg.test(this.secretKey);
	},

	createPostOptions: function(url, path, method){
		// set the request options
		var post_options = {
			host: url,
			path: path,
			method: method,
		  	headers: {
		      'Content-Type': 'application/x-www-form-urlencoded',
		      'X-ApiKey': this.secretKey
		  	}
		};
		return post_options;
	},

	createRequest: function(type, additional_path){
		var url;
		var path;
		var method;
		var additional_path = additional_path||'';
		if (!this.checkProjectEnv() && type === "onetimetoken") {
			method = "Post";
			url = this.BRICK_ONETIMETOKEN_TEST_BASE_URL;
			path = this.BRICK_ONETIMETOKEN_TEST_PATH;
		} else {
			url = this.BRICK_BASE_URL;
			method = "Post";
			if (type === "onetimetoken") {
				path = this.BRICK_ONETIMETOKEN_PATH;
			} else if (type === "charge"){
				path = this.BRICK_CHARGE_PATH+additional_path;
			} else if (type === "subscription"){
				path = this.BRICK_SUBSCRIPTION_CHARGE_PATH+additional_path;
			};
		};

		var post_options = 	this.createPostOptions(url, path, method);
		return post_options;
	},

});

module.exports = ApiObject;
