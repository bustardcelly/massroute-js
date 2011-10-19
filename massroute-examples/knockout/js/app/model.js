(function( $, ko ) {
    
    // Namespace for app.
    window['massroute'] = window.massroute || {};
    window.massroute['model'] = window.massroute.model || {};
    
    var Session = (function() {
        this.routes = undefined;
        this.selectedRoute = undefined;
        this.configurationCache = {};
    });
    
    var Route = (function() {
        this.tag = ''
        this.title = '';
        
        this.inflate = function( xml ) {
            this.tag = $(xml).attr( 'tag' );
            this.title = $(xml).attr( 'title' );
            return this;
        };
    });

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

    var RouteConfiguration = (function() {
        var _stops = {},
            _stopsByDestination = {};

        this.route = undefined;
        this.destinations = [];

        function addStop( xml ) {
            var stop = new massroute.model.RouteStop().inflate( xml );
            _stops[stop.tag] = stop;
        }

        function addDestination( xml, list ) {
            list[list.length] = new massroute.model.RouteDestination().inflate( xml );
        }

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

        this.findStopByTag = function( value ) {
            return ( _stops.hasOwnProperty( value ) ? _stops[value] : undefined );
        }

        this.findDestinationByTag = function( value ) {
            return ko.utils.arrayFirst( this.destinations, function( item ) {
               item.tag === value; 
            });
        }

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