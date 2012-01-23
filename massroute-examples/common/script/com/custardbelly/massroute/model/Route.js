define(['com/custardbelly/massroute/model/InflatableModel'], function( InflatableModel ) {
	
	var Route = (function( tag, title ) {
		this.tag = tag || undefined;
		this.title = title || undefined;
	});

	Route.prototype = new InflatableModel();
	Route.prototype.constructor = Route;

	return Route;

});