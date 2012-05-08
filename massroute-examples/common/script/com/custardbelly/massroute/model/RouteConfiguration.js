define( function() {

	/**
	 * Configuration model representing a route from MassDOT.
	 * @return {RouteConfiguration}
	 */
	var RouteConfiguration = (function( arrayUtility ) {
        var _ = arrayUtility,
            _stops = {},
            _stopsByDestination = {},
             /**
	         * Adds a stop to the map of stops based on tag properties.
	         * @param {value} Object The generic object to inflat the RouteStop model with.
	         * @param {map} Object Map of stops, key defined by RouteStop tag.
	         */
	        _addStop = function( value, map ) {
	            var stop = new massroute.model.RouteStop().inflate( value );
	            map[stop.tag] = stop;
	        },
	        /**
	         * Adds a destination to the list of destinations.
	        * @param {value} Object The generic object to inflat the RouteStop model with.
	         * @param {Array} list The target list to add the destination to.
	         */
	        _addDestination = function( value, list ) {
	            list[list.length] = new massroute.model.RouteDestination().inflate( value );
	        };

        this.route = undefined;
        this.destinations = [];

        /**
         * Inflates this model with associated Route, stops and directions.
         * @param  {Route} route      
         * @param  {Array} stops      List of generic Object which will be cast as RouteStop[]
         * @param  {Array} directions List of generic Object which will be cast as RouteDirection[]
         * @return {RouteConfiguration}	
         */
        this.inflate = function( route, stops, directions ) {
            this.route = route;
            
            _.each( stops, function( value ) {
               addStop( value, _stops ); 
            });
            _.each( directions, function( value ) {
               addDestination( value, self.destinations ); 
            });
            return this;
        }

        /**
         * Finds stop within map based on supplied value corresponding to the tag property on RouteStop.
         * @param  {String} value The tag property value to look-up.
         * @return {massroute.model.RouteStop}
         */
        this.findStopByTag = function( value ) {
            return ( _stops.hasOwnProperty( value ) ? _stops[value] : undefined );
        }

        /**
         * Finds the destination within the list based on the supplied value corresponding to that tag property on RouteDestination.
         * @param  {String} value The tag property value to look-up.
         * @return {massroute.model.RouteDestination}
         */
        this.findDestinationByTag = function( value ) {
        	return _.find( this.destinations, function(item) {
        		return item.tag == value;
        	});
        }

        /**
         * Finds list of stops along destination.
         * @param  {massroute.model.RouteDestination} destination The target destination to find stops along.
         * @return {Array}
         */
        this.stopsForDestination = function( destination ) {
            var payload,
                destinationStops,
                configurationStops,
                destinationTag = destination.tag;

            payload = ( _stopsByDestination.hasOwnProperty( destinationTag ) ? _stopsByDestination[destinationTag] : null );
            if( payload === null ) {
                payload = [];
                destinationStops = destination.stops;
                configurationStops = _stops;
                _.each( destinationStops, function( value ) {
                    payload[payload.length] = configurationStops[this.tag];
                });
                _stopsByDestination[destinationTag] = payload;
            }
            return payload;
        }
    });
	
	return RouteConfiguration;

});