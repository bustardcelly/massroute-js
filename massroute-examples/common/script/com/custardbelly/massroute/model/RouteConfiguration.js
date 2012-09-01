define( ['com/custardbelly/massroute/model/RouteStop', 'com/custardbelly/massroute/model/RouteDestination'], 
            function( RouteStop, RouteDestination ) {

	/**
	 * Configuration model representing a route from MassDOT.
	 * @return {RouteConfiguration}
	 */
	var RouteConfiguration = (function( arrayUtility ) {
        this._ = arrayUtility;
        this.stops = {};
        this.stopsByDestination = {};
        this.route = undefined;
        this.destinations = [];
    });

    /**
     * Inflates this model with associated Route, stops and directions.
     * @param  {Route} route      
     * @param  {Array} stops      List of generic Object which will be cast as RouteStop[]
     * @param  {Array} directions List of generic Object which will be cast as RouteDirection[]
     * @return {RouteConfiguration} 
     */
    RouteConfiguration.prototype.inflate = function( route, stops, directions ) {
            
            /**
             * Adds a stop to the map of stops based on tag properties.
             * @param {value} Object The generic object to inflat the RouteStop model with.
             * @param {map} Object Map of stops, key defined by RouteStop tag.
             */
        var _addStop = function( value, map ) {
                var stop = new RouteStop().inflate( value );
                map[stop.tag] = stop;
            },
            /**
             * Adds a destination to the list of destinations.
             * @param {value} Object The generic object to inflat the RouteStop model with.
             * @param {Array} list The target list to add the destination to.
             */
            _addDestination = function( value, list ) {
                list[list.length] = new RouteDestination().inflate( value );
            },
            stops = this.stops,
            destinations = this.destinations;

        this.route = route;
            
        this._.each( stops, function( value ) {
            _addStop( value, stops ); 
        });
        this._.each( directions, function( value ) {
            _addDestination( value, destinations ); 
        });
        return this;
    };
    
    /**
     * Finds stop within map based on supplied value corresponding to the tag property on RouteStop.
     * @param  {String} value The tag property value to look-up.
     * @return {massroute.model.RouteStop}
     */
    RouteConfiguration.prototype.findStopByTag = function( value ) {
        return ( this.stops.hasOwnProperty( value ) ? this.stops[value] : undefined );
    };

    /**
     * Finds the destination within the list based on the supplied value corresponding to that tag property on RouteDestination.
     * @param  {String} value The tag property value to look-up.
     * @return {massroute.model.RouteDestination}
     */
    RouteConfiguration.prototype.findDestinationByTag = function( value ) {
        return this._.find( this.destinations, function(item) {
            return item.tag == value;
        });
    };

    /**
     * Finds list of stops along destination.
     * @param  {massroute.model.RouteDestination} destination The target destination to find stops along.
     * @return {Array}
     */
    RouteConfiguration.prototype.stopsForDestination = function( destination ) {
        var payload,
            destinationStops,
            configurationStops,
            destinationTag = destination.tag;

        payload = ( this.stopsByDestination.hasOwnProperty( destinationTag ) ? this.stopsByDestination[destinationTag] : null );
        if( payload === null ) {
            payload = [];
            destinationStops = destination.stops;
            configurationStops = this.stops;
            this._.each( destinationStops, function( value ) {
                payload[payload.length] = configurationStops[this.tag];
            });
            this.stopsByDestination[destinationTag] = payload;
        }
        return payload;
    };
	
	return RouteConfiguration;

});