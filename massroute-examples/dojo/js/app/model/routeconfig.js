dojo.provide( "model.routeconfig" );

dojo.require( "model.route" );
dojo.require( "model.routestop" );
dojo.require( "model.routedestination" );

dojo.declare( 'model.routeconfig.RouteConfiguration', null, {
   constructor: function( xml ) {
        this.raw = xml,
        this.route = undefined;
        this.destinations = [];
        this._stops = {};
        this._stopByDestMap = {};
        
        if( typeof xml != "undefined" ) {
            this.inflate( xml );
        }
   },
   _addDestination: function( xml ) {
        this.destinations[this.destinations.length] = new model.routedestination.RouteDestination( xml );
   },
   _addStop: function( xml ) {
        if( dojo.hasAttr( xml, 'stopId' ) ) {
            var stop = new model.routestop.RouteStop( xml );
            this._stops[stop.tag] = stop;
        }
   },
   inflate: function( xml ) {
        var self = this,
            routeNode, routeStops, routeDirections;
        
        routeNode = dojo.query( 'route', xml ).at(0);
        routeStops = dojo.query( 'stop', xml );
        routeDirections = dojo.query( 'direction', xml );
        
        this.route = new model.route.Route( routeNode.attr('tag')[0], routeNode.attr('title')[0] );
        routeStops.forEach( function( node, index ) {
            dojo.hitch( self, self._addStop )( node );
        });
        routeDirections.forEach( function( node, index ) {
            dojo.hitch( self, self._addDestination )( node );
        });
   },
   findStopFromTag: function( value ) {
        if( this._stops.hasOwnProperty( value ) ) {
            return this._stops[value];
        }
        return undefined;
   },
   findDestinationByTag: function( value ) {
        var i, destination;
        i = this.destinations.length;
        while( --i > -1 )
        {
            destination = this.destinations[i];
            if( ( destination !== undefined ) && ( destination.tag === value ) ) {
                break;
            }
            else{
                destination = undefined;
            }
        }
        return destination;
    },
    stopsForDestination: function( destination ) {
        var destinationTag, payload, destinationStops, configStops;
        destinationTag = destination.tag;
        payload = ( this._stopByDestMap[destinationTag] !== undefined ) ? this._stopByDestMap[destinationTag] : null;
        if( payload === null ) {
            payload = [];
            destinationStops = destination.stops;
            configStops = this._stops;
            dojo.forEach( destinationStops, function( item, index ){
                if( configStops.hasOwnProperty( item ) ) {
                    payload[payload.length] = configStops[item];
                }
            });
            this._stopByDestMap[destinationTag] = payload;
        }
        return payload;
    },
   toString: function() {
        return "model.routeconfig.RouteConfiguration";
   }
});