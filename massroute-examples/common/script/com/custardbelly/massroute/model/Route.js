define(['com/custardbelly/massroute/model/InflatableModel'], function( InflatableModel ) {
	
	var Route = (function() {
		this.tag = '';
		this.title = '';
	});

	Route.prototype = new InflatableModel();
	Route.prototype.constructor = Route;

	return Route;

});