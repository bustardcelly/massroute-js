require( ['com/custardbelly/massroute/model/RouteStop'], function( RouteStop ) {

	module('RouteStop Test');
	
	test( 'inflate instance', function() {
		var routeStop = new RouteStop().inflate( {tag:'hello', title:'world', stopId:'foo'} );
		equals( routeStop.stopId, 'foo', 'Inflate object applied.' );
	});
	
});