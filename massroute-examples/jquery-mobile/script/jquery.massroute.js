(function( $ ) {
    $.massroute = $.massroute || {};
    $.extend( $.massroute, {
        getRoutes: function( options ) {
            queue( _getRoutes, options );
        },
        getConfig: function( route, options ) {
            queue( _getConfig, route, options );
        },
        getStops: function( destinationTag, options ) {
            // Parsed previously on getConfig(). Still go through service to access stops as the API may change for the service.
            var destination = ( _config === undefined ) ? undefined : _config.findDestinationByTag( destinationTag );
            if( destination === undefined ) {
                options.fault( "Could not find stops for destination " + destinationTag );
            }
            else {
                options.result( _config.stopsForDestination( destination ) );    
            }
        },
        getPredictions: function( stop, options ) {
            if( _route === undefined ) {
                options.fault( "Could not load predictions for: " + stop );
            }
            queue( _getPredictions, stop, options );
        },
        getRouteById: function( routeTag ) {
            if( _routeList === undefined || _routeList.length === 0 ) {
                return undefined;
            }
            
            var i, route;
            i = _routeList.length;
            while( --i > -1 ) {
                route = _routeList[i];
                if( route.tag === routeTag ) {
                    break;
                }
                else {
                    route = undefined;
                }
            }
            return route;
        },
        getDestinationById: function( destinationTag ) {
            if( _config === undefined ) {
                return null;
            }   
            return _config.findDestinationByTag( destinationTag );
        },
        getStopById: function( stopTag ) {
            if( _config === undefined ) {
                return null;
            }
            return _config.findStopByTag( stopTag );
        }
    });
    
    var _route, _routeList, _config;
    
    /* Internal Methods for Queue. */
    function _getRoutes( options ) {
        $.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta" )
                .done( function( xml ) {
                    _routeList = [];
                    $(xml).find("route").each( function() {
                       _routeList.push( new Route().inflate( this ) );
                    });
                    options.result( _routeList );
                })
                .fail( options.fault );
    }
    
    function _getConfig( route, options ) {
        _route = route;
        $.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=mbta&r=" + route )
                .done( function( xml ) {
                    if( _config === undefined ) {
                        _config = new RouteConfiguration();
                    }
                    _config.inflate( xml );
                    options.result( _config );
                })
                .fail( options.fault );
    }
    
    function _getPredictions( stop, options ) {
        $.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=mbta&r=" + _route + "&s=" + stop )
                .done( function( xml ) {
                    var predictions = [];
                    $(xml).find("prediction").each( function() {
                        predictions.push( new StopPrediction().inflate( this ) );
                    });
                    options.result( predictions );
                })
                .fail( options.fault );
    }
    
    /*
      Queue for service requests.
      It is stated in the MassDOT license agreement that requests on the server should not be made in larger than 10 second intervals.
      This is a simple queue to delay requests by that interval as they are invoked on $.massroute.
    */
    var _queue, _running, _delayTimer, _delay = 10000;
    
    function loadNext() {
        if( _queue.length > 0 ) {
            _running = true;
            var command = _queue.shift();
            command.methodName.apply( this, command.args );
            _delayTimer = setInterval( loadNext, _delay );
        }
        else {
            _running = false;
            clearTimeout( _delayTimer );
        }
    }
    
    function queue( methodName ) {
        var args, i, length
        args = [];
        length = arguments.length;
        for( i = 1; i < length; i++ ) {
            args[args.length] = arguments[i];
        }
        
        if( _queue === undefined ) {
            _queue = [];
        }
        _queue.push({methodName:methodName, args:args});
        if( !_running ) {
            clearTimeout( _delayTimer );
            loadNext();
        }
    }
    
})(jQuery);