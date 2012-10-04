var http 		= require('http'),
	parser 		= require('libxml-to-js'),
	parse_util 	= require('./parse-util'),
	log4js 		= require('log4js'),
	logger  	= log4js.getLogger('proxy'),
	// Requirement in using MassDOT service that client can only make a request at most every 10 seconds.
	delay 		= 10000,
	delayTimer	= 0,
	queue 		= [],
	processing 	= false,
	Request = {
		options: undefined,
		parseDelegate: undefined,
		deferred: undefined,
		execute: function() {
			var self = this;
			http.get( self.options, function( http_res ) {
				var data = '';
			    http_res.on('data', function(chunk) {
			        data += chunk;
			    })
			    .on('end', function() {
			    	parser( data, self.parseDelegate(self.deferred) );
			    });
			})
			.on('error', function(e) {
			  self.deferred( JSON.stringify({error:e.message}) );
			});
		}
	};

// http://onemoredigit.com/post/1527191998/extending-objects-in-node-js
Object.defineProperty(Object.prototype, "extend", {
	enumerable: false,
	value: function(from) {
	    var props = Object.getOwnPropertyNames(from);
	    var dest = this;
	    props.forEach(function(name) {
	        var destination = Object.getOwnPropertyDescriptor(from, name);
	        Object.defineProperty(dest, name, destination);
	    });
	    return this;
}
});

function loadNext() {
	clearTimeout( delayTimer );
	if( queue.length > 0 ) {
		logger.debug( 'Request being processed...' );
		processing = true;
		queue.shift().execute();
		delayTimer = setTimeout( loadNext, delay );
	}
	else {
		processing = false;
	}
}

function queueRequest( options, parseDelegate, deferred ) {
	queue[queue.length] = Object.create(Request).extend({
		options: options, 
		parseDelegate: parseDelegate, 
		deferred: deferred
	});
	if( !processing ) {
		logger.debug( 'Processing freed up for request.' );
		loadNext();
	}
	else {
		logger.debug( 'Request delayed...' + delayTimer + 'ms' );
	}
};

exports.parse_util = parse_util;
exports.requestData = function( options, parseDelegate, deferred ) {
	logger.debug( 'New request for data...' + options );
	queueRequest(options, parseDelegate, deferred);	
}