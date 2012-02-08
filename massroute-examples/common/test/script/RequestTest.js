require( ['com/custardbelly/js/RequestToken', 'com/custardbelly/js/Request'], function( RequestToken, Request ) {
	
	module( "Request Test" );
	
	test( 'send returns RequestToken', function() {
		var token,
			xhr = new Request( 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta' );
		
		token = xhr.send();
		equals( ( token !== 'undefined' ), true, 'Request.send() returns RequestToken' );
	});

	test( 'result is XML (or fault on no service)', function() {
		stop();
		var token,
			xhr = new Request( 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta' );
		
		function handleResult( value ) {
			equals( ( value && ( 'getElementsByTagName' in value ) ), true, 'Value returned is of Document (XML) type.' );
			start();
		}

		function handleFault( value ) {
			equals( ( typeof value != 'undefined' ), true, 'Fault in request to test positive Result. Message: ' + value );
			start();
		}
		
		setTimeout( function() {
			token = xhr.send().then( handleResult, handleFault );
		}, 100);
	});

	test( 'token is updated on result (or fault on no service)', function() {
		stop();
		var token,
			xhr = new Request( 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta' );
		
		function handleResult( value ) {
			equals( token.getState(), 'resolved', 'Token state updated on result.' );
			start();
		}

		function handleFault( value ) {
			equals( token.getState(), 'rejected', 'Token state updated on fault.' );
			start();
		}
		
		setTimeout( function() {
			token = xhr.send().then( handleResult, handleFault );
		}, 100);
	});

});