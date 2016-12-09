'use strict';

exports.getParameter = function(parameter, JSON_chunk){
	return JSON_chunk[parameter];
};