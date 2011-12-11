;(function(window) {

	module('RequestToken');
	
	test( 'result handler', function() {
		stop();
		var token = new com.custardbelly.js.RequestToken(),
			message = 'Hello World!';

		function handleResult( value ) {
			equals( value, message, 'pass. resolved to current value' );
			start();
		}

		token.then( handleResult );
		setTimeout( function() {
			token.setState( 'resolved', message );
		}, 100)
	});

	test( 'fault handler', function() {
		stop();
		var token = new com.custardbelly.js.RequestToken(),
			message = 'UH-OH!';
		
		function handleFault( value ) {
			equals( value, message, 'pass. rejected to current value' );
			start();
		}

		token.then( null, handleFault );
		setTimeout( function() {
			token.setState( 'rejected', message )
		}, 100);
	});

	test( 'progress handler', function() {
		stop();
		var token = new com.custardbelly.js.RequestToken(),
			progress = 0;
		
		function handleProgress( value ) {
			equals( value, progress, 'pass. progress accepted' );
			start();
		}

		token.then( null, null, handleProgress );
		setTimeout( function() {
			progress = 100;
			token.setState( 'progress', progress );	
		}, 100);
	});

})(this);