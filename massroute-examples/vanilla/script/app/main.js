(function( require ) {
	
	var service, token, parser,
		Route;

	function handleRoutes( value ) {
		var routeList = parser.getNodeMapList(value, 'route'),
			i = 0, length = routeList.length, routes = [];
		for( i; i < length; i++ ) {
			routes[routes.length] = new Route().inflate(routeList[i]);
		}
		// console.info( routes );
	}

	function handleFault( value ) {
		console.error( 'main:handleFault-\n', value );
	}

	function handleContextLoad( context, RouteProto ) {
		Route = RouteProto;
		service = context.service;
		parser = context.parser;
		token = service.getRoutes();
		token.then( handleRoutes, handleFault );
	};

	require( ['app/context', 'com/custardbelly/massroute/model/Route'], handleContextLoad );
	
}( requirejs ));