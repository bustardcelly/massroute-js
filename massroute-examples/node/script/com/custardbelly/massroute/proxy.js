var http 		= require('http'),
	parser 		= require('libxml-to-js'),
	parse_util 	= require('./parse-util');

exports.parse_util = parse_util;
exports.requestData = function( options, parseDelegate, deferred ) {
	http.get( options, function( http_res ) {
		var data = '';
	    http_res.on('data', function(chunk) {
	        data += chunk;
	    })
	    .on('end', function() {
	    	parser( data, parseDelegate(deferred) );
	    });
	})
	.on('error', function(e) {
	  deferred( JSON.stringify({error:e.message}) );
	});
}