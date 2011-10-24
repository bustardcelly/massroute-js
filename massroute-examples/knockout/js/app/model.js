(function( $, ko ) {
    
    // Namespace for app.
    window['massroute'] = window.massroute || {};
    window.massroute['model'] = window.massroute.model || {};
    
    /**
     * Overall session model that holds state of the application.
     * @return {massroute.model.Session}
     */
    var Session = (function() {
        this.routes = undefined;
        this.selectedRoute = undefined;
        this.configurationCache = {};
    });
    
    /**
     * Model representation of a Route from MassDOT.
     * @return {massroute.model.Route}
     */
    var Route = (function() {
        this.tag = ''
        this.title = '';
        
        this.inflate = function( xml ) {
            this.tag = $(xml).attr( 'tag' );
            this.title = $(xml).attr( 'title' );
            return this;
        };
    });

    /**
     * Model representation of a stop along a route from MassDOT.
     * @return {massroute.model.RouteStop}     
     */
    var RouteStop = (function() {
        this.tag = '';
        this.title = '';
        this.latitude = '';
        this.longitude = '';
        this.stopId = '';
        
        this.inflate = function( xml ) {
            this.tag = $(xml).attr( 'tag' );
            this.title = $(xml).attr( 'title' );
            this.dirTag = $(xml).attr( 'dirTag' );
            this.stopId = $(xml).attr( 'stopId' );
            return this;
        }; 
    });

    /**
     * Model representation of a destination along a route from MassDOT.
     * @return {massroute.model.RouteDestination}
     */
    var RouteDestination = (function() {
        this.tag = '';
        this.name = '';
        this.title = '';
        this.stops = [];
        
        this.inflate = function( xml ) {
            this.tag = $(xml).attr( 'tag' );
            this.name = $(xml).attr( 'name' );
            this.title = $(xml).attr( 'title' );
            var $stops = this.stops;
            $(xml).find( 'stop' ).each( function() {
                var stop = new massroute.model.RouteStop().inflate(this);
                $stops[$stops.length] = stop;
            });
            return this;
        };
    });

    /**
     * Model representation of a route configuration from MassDOT.
     * @return {massroute.model.RouteConfiguration}
     */
    var RouteConfiguration = (function() {
        var _stops = {},
            _stopsByDestination = {};

        this.route = undefined;
        this.destinations = [];

        /**
         * Adds a stop to the map of stops based on tag properties.
         * @param {XML} xml The XML representation of a stop.
         */
        function addStop( xml ) {
            var stop = new massroute.model.RouteStop().inflate( xml );
            _stops[stop.tag] = stop;
        }

        /**
         * Adds a destination to the list of destinations.
         * @param {XML} xml XML representation of a destination.
         * @param {Array} list The target list to add the destination to.
         */
        function addDestination( xml, list ) {
            list[list.length] = new massroute.model.RouteDestination().inflate( xml );
        }

        /**
         * Fills this model based on the XML data.
         * @param  {XML} xml XML representation of a route configuration.
         * @return {massroute.model.RouteConfiguration}
         */
        this.inflate = function( xml ) {
            var self = this,
                routeNode, routeStops, routeDirections;
        
            routeNode = $(xml).find( 'route' );
            routeStops = $(routeNode).children( 'stop' );
            routeDirections = $(routeNode).children( 'direction' );
            this.route = new massroute.model.Route().inflate( routeNode );
            
            $.each( routeStops, function( index, value ) {
               addStop( value ); 
            });
            $.each( routeDirections, function( index, value ) {
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
            return ko.utils.arrayFirst( this.destinations, function( item ) {
               item.tag === value; 
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
                $.each( destinationStops, function( index, value ) {
                    payload[payload.length] = configurationStops[this.tag];
                });
                _stopsByDestination[destinationTag] = payload;
            }
            return payload;
        }
    });

    /**
     * Model representation of a prediction for a stop along a route from MassDOT.
     * @return {massroute.model.StopPrediction}
     */
    var StopPrediction = (function() {
        this.seconds = 0;
        this.minutes = 0;
        this.epochTime = '';
        this.isDeparture = false;
        this.dirTag = '';
        this.affectedByLayover = false;
        this.delayed = false;
        this.slowness = 0;
        
        this.inflate = function( xml ) {
            this.seconds = Number($(xml).attr( 'seconds' ));
            this.minutes = Number($(xml).attr( 'minutes' ));
            this.epochTime = $(xml).attr( 'epochTime' );
            this.isDeparture = ( $(xml).attr( 'isDeparture' ) === 'true' ) ? true : false;
            this.dirTag = $(xml).attr('dirTag');
            this.affectedByLayover = ( $(xml).attr( 'affectedByLayover' ) === 'true' ) ? true : false;
            this.delayed = ( $(xml).attr( 'delayed' ) === 'true' ) ? true : false;
            this.slowness = Number($(xml).attr( 'slowness' ));
            return this;
        };
    });
    
    window.massroute.model.Session = Session;
    window.massroute.model.Route = Route;
    window.massroute.model.RouteConfiguration = RouteConfiguration;
    window.massroute.model.RouteStop = RouteStop;
    window.massroute.model.RouteDestination = RouteDestination;
    window.massroute.model.StopPrediction = StopPrediction;

})( jQuery, ko );