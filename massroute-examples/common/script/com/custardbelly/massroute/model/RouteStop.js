define(['com/custardbelly/massroute/model/InflatableModel'], function( InflatableModel ) {
	
	var RouteStop = (function( tag, title, latitude, longitude, stopId ) {
		this.tag = tag || undefined;
        this.title = title || undefined;
        this.latitude = latitude || undefined;
        this.longitude = longitude || undefined;
        this.stopId = stopId || undefined;
	});

	RouteStop.prototype = new InflatableModel();
	RouteStop.prototype.constructor = RouteStop;

	return RouteStop;

});