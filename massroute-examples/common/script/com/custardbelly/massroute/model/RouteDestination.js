define(['com/custardbelly/massroute/model/InflatableModel'] function( InflatableModel ) {
	 
	var RouteDestination = (function(tag, name, title, stops) {
        this.tag = '';
        this.name = '';
        this.title = '';
        this.stops = [];
    });

	 RouteDestination.prototype = new InflatableModel();
	 RouteDestination.prototype.constructor = RouteDestination;

	 return RouteDestination;
});