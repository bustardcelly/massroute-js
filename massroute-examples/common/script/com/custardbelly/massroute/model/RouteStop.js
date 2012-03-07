define(['com/custardbelly/massroute/model/InflatableModel'], function( InflatableModel ) {
	
	var RouteStop = (function() {
		this.tag = '';
        this.title = '';
        this.latitude = ''
        this.longitude = '';
        this.stopId = '';
	});

	RouteStop.prototype = new InflatableModel();
	RouteStop.prototype.constructor = RouteStop;

	return RouteStop;

});