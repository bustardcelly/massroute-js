dojo.provide( "service.mbta" );

dojo.require( "model.session" );
dojo.require( "model.route" );
dojo.require( "model.routeconfig" );
dojo.require( "model.routeprediction" );

dojo.declare( "service.mbta.ServiceQueue", null, {
    constructor: function() {
        this._queue = [];
        this._running = false;
        this._delayInterval = 0;
    },
    _loadNext: function() {
        if( this._queue.length > 0 ) {
            this._running = true;
            var command = this._queue.shift();
            command.method.apply( null, command.args );
            this._delayInterval = setTimeout( dojo.hitch( this, this._loadNext ), 10000 );
            console.info( "[" + this.toString() + "] :: Delayed next call: " + this._delayInterval );
        }
        else {
            this._running = false;
            clearTimeout( this._delayInterval );
            console.info( "[" + this.toString() + "] :: Queue finished" );
        }  
    },
    add: function( method ) {
        var args, i, length
        args = [];
        length = arguments.length;
        // push args after method.
        for( i = 1; i < length; i++ ) {
            args[args.length] = arguments[i];
        }
        // queue.
        this._queue.push( {method:method, args:args} );
        // load next.
        if( !this._running ) {
            clearTimeout( this._delayInterval );
            this._loadNext();
        }
    },
    toString: function() {
        return "service.mbta.ServiceQueue";
    }
});

dojo.declare( "service.mbta.Service", null, {
    constructor: function() {
        this._requests = new service.mbta.ServiceQueue();
    },
    _getRoutes: function( delegate ) {
        console.info( "[" + this.toString() + "] :: _getRoutes()" );
        var self = this,
            promise = dojo.xhrGet( {
                            url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta",
                            handleAs: "xml",
                            failOk: false,
                            handle: function( response, ioargs ) {
                              console.info( "[" + self.toString() + "] :: Status response for routelist: " + ioargs.xhr.status );
                            }
                        });
            
        dojo.when( promise, 
            function( xml ) {
                var routelist = []; // model.route.Route[]
                // If null, request has come back 200 but no data. boo. testing in HTTP sniffer reveals that dojo still returns 200 on a 302 :(
                if( xml === null ) {
                    delegate.fault.call( null, "Error requesting routes.\nPlease try again later.")
                    return;
                }
                // Else we have data, lets cache it in our Session model.
                dojo.query( 'route', xml ).forEach( function( node, index ) {
                    routelist[routelist.length] = new model.route.Route( dojo.attr(node, 'tag'), dojo.attr(node, 'title') );
                });
                // ... and let our delegate know.
                delegate.result.call( null, routelist );
            },
            delegate.fault
        );
    },
    _getConfig: function( routeTag, delegate ) {
        console.info( "[" + this.toString() + "] :: _getConfig()" );
        var self = this,
            promise = dojo.xhrGet( {
                            url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=mbta&r=" + routeTag,
                            handleAs: "xml",
                            failOk: false,
                            handle: function( response, ioargs ) {
                                console.info( "[" + self.toString() + "] :: Status response for route " + routeTag + " config: " + ioargs.xhr.status );
                            }
                        });
        
        dojo.when( promise,
            function( xml ) {
                var configuration = undefined;
                if( xml === null ) {
                    delegate.fault.call( null, "Error requesting route configuration for " + routeTag + ".\nPlease try again later." );
                    return;
                }
                configuration = new model.routeconfig.RouteConfiguration( xml );
                delegate.result.call( null, configuration );
            },
            delegate.fault
        );
    },
    _getPredictions: function( routeTag, stopId, delegate ) {
        console.info( "[" + this.toString() + "] :: _getPredictions()" );
        var self = this,
            promise = dojo.xhrGet( {
                url: "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=mbta&r=" + routeTag + "&s=" + stopId,
                handleAs: 'xml',
                failOk: false,
                handle: function( response, ioargs ) {
                    console.info( "[" + self.toString() + "] :: Status repsonse for predictions on " + routeTag + " at stop " + stopId + ": " + ioargs.xhr.status );
                }
            });
        
        dojo.when( promise,
            function( xml ) {
                var predictions = []; // model.routeprediction.StopPrediction[]
                if( xml === null ) {
                    delegate.fault.call( null, "Error requesting predicstions for " + stopId + " along Route " + routeTag + ".\nPlease try again later." );
                    return;
                }
                dojo.query( 'prediction', xml ).forEach( function( node, index ) {
                    predictions[predictions.length] = new model.routeprediction.StopPrediction( node );
                });
                delegate.result.call( null, predictions );
            },
            delegate.fault
        );
    },
    getRoutes: function( delegate /* {result:function, fault:function} */ ) {
        console.info( "[" + this.toString() + "] :: getRoutes()" );
        this._requests.add( dojo.hitch( this, this._getRoutes ), delegate );
    },
    getConfig: function( routeTag, delegate /* {result:function, fault:function} */ ) {
        console.info( "[" + this.toString() + "] :: getConfig()" );
        this._requests.add( dojo.hitch( this, this._getConfig ), routeTag, delegate );
    },
    getPredictions: function( routeTag, stopId, delegate /* {result:function, fault:function} */ ) {
        console.info( "[" + this.toString() + "] :: getPredictions()" );
        this._requests.add( dojo.hitch( this, this._getPredictions ), routeTag, stopId, delegate );
    },
    toString: function() {
        return "service.mbta.Service";
    }
});