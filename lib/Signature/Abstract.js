'use strict';
var querystring = require('querystring');
exports.sortObject = function (o) {
	var baseString = "";
	if (typeof(o)=== 'object') {
		Object.keys(o).sort().forEach(function(key,i) {
			if (typeof(o[key])=== 'object') {
				Object.keys(o[key]).sort().forEach(function(sub_key,sub_i) {
					var value = o[key][sub_key] || "";
					baseString += key + '['+sub_key+']'+'=' + value;
				});
			} else {
				var value = o[key] || "";

				baseString += key + '=' + value;
			}
		});
	}
	return baseString;
}