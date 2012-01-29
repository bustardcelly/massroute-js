require( ['com/custardbelly/js/RequestToken'], function( RequestToken ) {

	module('Request Token Test');
	
	test( 'result handler', function() {
		stop();
		var token = new RequestToken(),
			message = 'Hello World!';

		function handleResult( value ) {
			equals( value, message, 'Resolved to current value' );
			start();
		}

		token.then( handleResult );
		setTimeout( function() {
			token.setState( 'resolved', message );
		}, 100);
	});

	test( 'fault handler', function() {
		stop();
		var token = new RequestToken(),
			message = 'UH-OH!';
		
		function handleFault( value ) {
			equals( value, message, 'Rejected to current value' );
			start();
		}

		token.then( null, handleFault );
		setTimeout( function() {
			token.setState( 'rejected', message );
		}, 100);
	});

	test( 'progress handler', function() {
		stop();
		var token = new RequestToken(),
			progress = 0;
		
		function handleProgress( value ) {
			equals( value, progress, 'Progress accepted' );
			start();
		}

		token.then( null, null, handleProgress );
		setTimeout( function() {
			progress = 100;
			token.setState( 'progress', progress );	
		}, 100);
	});

});