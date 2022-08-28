'use strict';

exports.getParameter = function(parameter, JSON_chunk){
	return JSON_chunk[parameter];
};

exports.buildResponseFromErrorObject = function(err){
	if (typeof err.toJSON === 'undefined') {
		err.toJSON = function(){
			return {
				message: this.message,
				code: this.code,
				source: this.source
			};
		};
	}
	return {
		type: 'Error',
		code: 'ERROR_OBJECT',
		error: err.message,
		err: err
	};
}
