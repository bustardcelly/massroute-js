(function( require ) {
	
	var context,
		routesController;

	function handleContextLoad( ctx, rtesController ) {
		context = ctx;
		routesController = rtesController;
		context.completeDelegate = handleContextComplete;
	}

	function handleContextComplete() {
		// Set up routing.
		context.router.map( "routes", function() {
			routesController.activate();
		});
		context.router.map( "destinations", function() {
			console.log( 'show destinations' );
		});
		context.router.map( "stops", function() {
			console.log( 'show stops' );
		});
		context.router.map( "predictions", function() {
			console.log( 'show predictions' );
		});

		routesController.activate();
	}

	require( ['app/context', 'app/section/routes-section'], handleContextLoad );
	
}( requirejs ));