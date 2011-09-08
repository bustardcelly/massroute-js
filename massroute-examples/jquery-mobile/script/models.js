(function( window ) {
    
    function Route() {
        this.tag = undefined;
        this.title = undefined;
        
        this.inflate = function( xml ) {
            this.tag = $(xml).attr( "tag" );
            this.title = $(xml).attr( "title" );
            return this;
        };
    }
    
    function RouteStop() {
        this.tag = undefined;
        this.title = undefined;
        this.dirTag = undefined;
        this.stopId = undefined;
        
        this.inflate = function( xml ) {
            this.tag = $(xml).attr( "tag" );
            this.title = $(xml).attr( "title" );
            this.dirTag = $(xml).attr( "dirTag" );
            this.stopId = $(xml).attr( "stopId" );
            return this;
        };
    }
    
    function StopPrediction() {
        this.seconds = undefined;
        this.minutes = undefined;
        this.epochTime = undefined;
        this.isDeparture = undefined;
        this.dirTag = undefined;
        this.vehicle = undefined;
        this.block = undefined;
        
        this.inflate = function( xml ) {
            this.seconds = Number($(xml).attr( "seconds" ));
            this.minutes = Number($(xml).attr( "minutes" ));
            this.epochTime = $(xml).attr( "epochTime" );
            this.isDeparture = ( $(xml).attr( "isDeparture" ) === "true" ) ? true : false;
            this.dirTag = $(xml).attr("dirTag");
            this.vehicle = $(xml).attr("vehicle");
            this.block = $(xml).attr("block");
            return this;
        };
    }
    
    function RouteDestination() {
        this.tag = undefined;
        this.name = undefined;
        this.title = undefined;
        this.stops = undefined;
        
        this.inflate = function( xml ) {
            this.tag = $(xml).attr( "tag" );
            this.name = $(xml).attr( "name" );
            this.title = $(xml).attr( "title" );
            this.stops = [];
            var $stops = this.stops;
            $(xml).find( "stop" ).each( function() {
                var stop = new RouteStop();
                stop.inflate( this );
                $stops[$stops.length] = stop;
            });
            return this;
        };
    }
    
    function RouteConfiguration() {
        var _stops = {};
        var _map = {};
        var _destinations = [];
        this.route = undefined;
        
        function reset() {
            _stops = {};
            _map = {};
            _destinations = [];
            this.route = undefined;
        }
        
        function addStop( xml ) {
            var stop = new RouteStop();
            stop.inflate( xml );
            _stops[stop.tag] = stop;
        }
        
        function addDestination( xml ) {
            var destination = new RouteDestination();
            destination.inflate( xml );
            _destinations.push( destination );
        }
        
        this.inflate = function( xml ) {
            reset();
            var routeNode, routeStops, routeDirections;
            routeNode= $(xml).find("route");
            routeStops = $(routeNode).children( "stop" );
            routeDirections = $(routeNode).children( "direction ");
            this.route = new Route();
            this.route.inflate( routeNode );
            $.each( routeStops, function( index, value ) {
               addStop( value ); 
            });
            $.each( routeDirections, function( index, value ) {
                addDestination( value );
            });
            return this;
        };
        
        this.findDestinationByTag = function( destinationTag ) {
            var i, destination;
            i = this.destinations.length;
            while( --i > -1 )
            {
                destination = this.destinations[i];
                if( ( destination !== undefined ) && ( destination.tag === destinationTag ) ) {
                    break;
                }
                else{
                    destination = undefined;
                }
            }
            return destination;
        };
        
        this.findStopByTag = function( stopTag ) {
            return _stops[stopTag];
        };
        
        this.stopsForDestination = function( destination ) {
            var destinationTag, payload;
            destinationTag = destination.tag;
            payload = ( _map[destinationTag] !== undefined ) ? _map[destinationTag] : null;
            if( payload === null )
            {
                payload = [];
                var destinationStops = destination.stops;
                var $configStops = _stops;
                $.each( destinationStops, function() {
                   payload[payload.length] = $configStops[this.tag]; 
                });
                _map[destinationTag] = payload;
            }
            return payload;
        };
        
        this.__defineGetter__("destinations", function() {
            return _destinations;
        });
        this.__defineSetter__("destinations", function( value ) {
           _destinations = value; 
        });
    }
    var rc = RouteConfiguration.prototype;
    rc.getDestinationsByType = function( type ) {
            var dirs, dests;
            dirs = [];
            dests = this.destinations;
            $.each( dests, function( index, value ) {
                if( value.name.toLowerCase() === type.toLowerCase() ) {
                    dirs.push( value );
                }
            });
            return dirs;
    };
    
    window.Route = Route;
    window.RouteStop = RouteStop;
    window.StopPrediction = StopPrediction;
    window.RouteDestination = RouteDestination;
    window.RouteConfiguration = RouteConfiguration;
    
})(window);