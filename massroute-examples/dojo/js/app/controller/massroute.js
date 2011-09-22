dojo.provide( "controller.massroute" );

dojo.require( "model.session" );
dojo.require( "service.mbta" );

dojo.declare( "controller.massroute.MassRouteController", null, {
   constructor: function( session, service ) {
        this._session = session;
        this._service = service;
   },
   _hasRoutes: function() {
        return ( typeof this._session.routes != 'undefined' ) && ( this._session.routes.length > 0 );
   },
   _hasConfig: function( routeTag ) {
        return this._session.getConfig( routeTag ) !== undefined;
   },
   _updateSessionOnConfiguration: function( routeTag, configuration ) {
        this._session.addConfig( routeTag, configuration.raw );
        this._session.currentConfiguration = configuration;
   },
   getRoutes: function() {
        var self = this,
            promise = new dojo.Deferred();
        
        console.log( '[' + this.toString() + '] :: getRoutes()' );
        if( self._hasRoutes() ) {
            console.log( '[' + this.toString() + '] :: from cache.' );
            promise.resolve( self._session.routes );
        }
        else {
            this._service.getRoutes( {
                result: function( list ) {
                    console.log( '[' + self.toString() + '] :: getRoutes.result' );
                    self._session.routes = list;
                    promise.resolve( list );
                },
                fault: function( error ) {
                    console.log( '[' + self.toString() + '] :: getRoutes.fault' );
                    promise.reject( error ); 
                }
            });   
        }
        return promise;
   },
   getConfig: function( routeTag ) {
        var self = this,
            promise = new dojo.Deferred(),
            configuration = undefined;
        
        console.log( '[' + this.toString() + '] :: getConfig() for ' + routeTag + '.' );
        if( this._hasConfig( routeTag ) ) {
            console.log( '[' + this.toString() + '] :: from cache.' );
            configuration = this._session.createConfig( this._session.getConfig( routeTag ) );
            this._updateSessionOnConfiguration( routeTag, configuration )
            promise.resolve( configuration )
        }
        else {
            this._service.getConfig( routeTag, {
                result: function( configuration ) {
                    console.log( '[' + self.toString() + '] :: getConfig.result' );
                    dojo.hitch( self, self._updateSessionOnConfiguration )( routeTag, configuration );
                    promise.resolve( configuration );
                },
                fault: function( error ) {
                    console.log( '[' + self.toString() + '] :: getConfig.fault' );
                    promise.reject( error );
                }
            });
        }
        return promise;
   },
   getStops: function( destinationTag ) {
        var destination,
            configuration = this._session.currentConfiguration,
            promise = new dojo.Deferred();
        
        console.log( '[' + this.toString() + '] :: getStops() for ' + destinationTag + '.' );
        if( ( typeof configuration != 'undefined' ) ) {
            console.log( '[' + this.toString() + '] :: from cache.' );
            destination = configuration.findDestinationByTag( destinationTag );
            if( ( typeof destination != 'undefined' ) ) {
                console.log( '[' + this.toString() + '] :: getStops() going to ' + destination.title + '.' );
                promise.resolve( configuration.stopsForDestination( destination ) );
            }
            else {
                promise.reject( "Could not find stops for " + destinationTag + ". No destination found related to value." );
            }
        }
        else {
            promise.reject( "Could not find stops for " + destinationTag + ". No configuration in current session." );
        }
        return promise;
   },
   getPredictions: function( stopTag ) {
        var self = this,
            route,
            stop,
            configuration = this._session.currentConfiguration,
            promise = new dojo.Deferred();
            
        if( ( typeof configuration != 'undefined' ) ) {
            route = configuration.route;
            stop = configuration.findStopFromTag( stopTag );
            if( ( typeof route != 'undefined' ) && ( typeof stop != 'undefined' ) ) {
                console.log( '[' + this.toString() + '] :: getPredictions for ' + stop.tag + ' along ' + route.tag );
                this._service.getPredictions( route.tag, stop.tag, {
                    result: function( predictions ) {
                        console.log( '[' + self.toString() + '] :: getPredictions.result' );
                        promise.resolve( predictions );
                    },
                    fault: function( error ) {
                        console.log( '[' + self.toString() + '] :: getPredictions.fault' );
                        promise.reject( error );
                    }
                });
            }
            else {
                promise.reject( "Could not find predictions for " + stopTag + ". No stop found related to value." );
            }
        }
        else {
            promise.reject( "Could not find predictions for " + stopTag + ". No configuration in current session." );
        }
        return promise;
   },
   toString: function() {
        return "controller.massroute.MassRouteController";
   }
});