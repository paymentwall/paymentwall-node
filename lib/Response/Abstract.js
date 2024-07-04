'use strict';
var Success = require('./Success');
var Err = require('./Err');

function CallbackRes(JSON_chunk, String_chunk){
	this.JSON_chunk = JSON_chunk;
	this.String_chunk = String_chunk;
}

CallbackRes.prototype = {

	isSuccessful: function(){
		if (this.JSON_chunk.hasOwnProperty('type')) {
			if (this.JSON_chunk.type==='Error') {
				return false;
			} else {
				return true;
			};
		} else if(this.JSON_chunk.hasOwnProperty('secure')){
			return true;
		} else {
			console.log(this.getFullResponse());
			return false;
		};
	},

	isCaptured: function(){
		return Success.getParameter('captured',this.JSON_chunk);
	},

	isRefunded: function(){
		return Success.getParameter('refunded',this.JSON_chunk);
	},

	isActivated: function(){
		return Success.getParameter('active',this.JSON_chunk);
	},

	isStarted: function(){
		return Success.getParameter('started',this.JSON_chunk);
	},

	isExpired: function(){
		return Success.getParameter('expired',this.JSON_chunk);
	},

	isUnderReview: function(){
		return Success.getParameter('risk',this.JSON_chunk) === 'pending';
	},

	getFullResponse: function(type){
		if (type==="JSON") {
			return this.JSON_chunk;
		} else {
			return this.String_chunk;
		}
	},

	get3DHtml: function(){
		var secure = Success.getParameter('secure',this.JSON_chunk);
		return secure.formHTML;
	},

	getChargeId: function(){
		if (this.JSON_chunk.object==='charge') {
			return Success.getParameter('id',this.JSON_chunk);
		} else {
			var all_chargeid = Success.getParameter('charge',this.JSON_chunk);
			return all_chargeid[(all_chargeid.length-1)];
		}

	},

	getOnetimeToken: function(){
		return Success.getParameter('token',this.JSON_chunk);
	},

	getPermanentToken: function(){
		if (this.JSON_chunk.hasOwnProperty('card')&&this.JSON_chunk.card!=null) {
			var card = Success.getParameter('token',this.JSON_chunk);
			return card.token;
		} else {
			return null;
		}
	},

	getCardInfo: function(){
		return Success.getParameter('card',this.JSON_chunk);
	},

	getTrialInfo: function(){
		return Success.getParameter('trial',this.JSON_chunk);
	},

	getSubscriptionId: function(){
		return Success.getParameter('id',this.JSON_chunk);
	},

	getErrorCode: function(){
		return Err.getParameter('code',this.JSON_chunk);
	},

	getErrorDetails: function(){
		return Err.getParameter('error',this.JSON_chunk);
	},

	getBrickResponse: function(){
		if (this.JSON_chunk.hasOwnProperty('type') && this.JSON_chunk.type==='Error') {
			return {
				success : 0,
				error : {
					message: this.getErrorDetails(),
					code: this.getErrorCode(),
				},
			}
		}

		if (Success.getParameter('secure',this.JSON_chunk)) {
			return {
				success : 0,
				secure: Success.getParameter('secure',this.JSON_chunk)
			}
		}
		if (this.isUnderReview()) {
			return {
				success : 0,
				payment: this.JSON_chunk,
				risk: 'pending'
			}
		}

		if (this.isSuccessful()) {
			return {
				success : 1,
				payment: this.JSON_chunk,
			}
		}
		return {
			success : 0,
			error : {
				message : 'Internal error'
			}
		}
	}

};

module.exports = CallbackRes;