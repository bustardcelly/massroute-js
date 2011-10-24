// $ = xhr library.
(function( $ ) {
    
    // Namespace for app.
    window["massroute"] = window.massroute || {};
    window.massroute["service"] = window.massroute.service || {};
    
    /**
     * The service queue to offset requests within a certain time frame determined by the developer agreement on MassDOT.
     * (function) denotes that This Revealing Module/Constructor should be used as a class.
     */
    var ServiceQueue = (function() {
        var _queue = [],
            _isRunning = false,
            _delayInterval = 0;

        /**
         * If command queue is full, runs request on next in line. If empty, shuts down movement within queue.
         */
        function _loadNext() {
            if( _queue.length > 0 ) {
                _isRunning = true;
                var command = _queue.shift();
                command.method.apply( null, command.args );
                _delayInterval = setTimeout( _loadNext, 10000 );
            }
            else {
                _isRunning = false;
                clearTimeout( _delayInterval );
            }  
        }

        /**
         * Adds a command to the queue. Uses arguments property to hold arguments for the command when current in queue.
         * @param  {Function} method The method to invoke when current in queue.
         */
        function _add( method ) {
            var args, i, length
            args = [];
            length = arguments.length;
            // push args after method.
            for( i = 1; i < length; i++ ) {
                args[args.length] = arguments[i];
            }
            // queue.
            _queue.push( {method:method, args:args} );
            // load next.
            if( !_isRunning ) {
                clearTimeout( _delayInterval );
                _loadNext();
            }
        }

        return {
            add: _add
        }
    });
    
    /**
     * The Service implementation that handles requests to the MassDOT service for real-time transportation data.
     * (function) denotes that This Revealing Module/Constructor should be used as a class.
     */
    var Service = (function() {
        var _queue = new ServiceQueue();
        
        /**
         * Makes request for route data on MassDOT service.
         * @param  {Object} responder Response delegate
         */
        function _getRoutes( responder ) {
            $.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta" )
                .done( function( xml ) {
                    var routelist = [];
                    $(xml).find("route").each( function() {
                       routelist.push( new massroute.model.Route().inflate( this ) );
                    });
                    responder.result( routelist );
                })
                .fail( responder.fault );
        };

        /**
         * Makes request for configuration of route on MassDOT service.
         * @param  {String} routeTag The tag property value of the target Route.
         * @param  {Object} responder Response delegate.
         */
        function _getConfig( routeTag, responder ) {
            $.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=mbta&r=" + routeTag )
                .done( function( xml ) {
                    var config = new massroute.model.RouteConfiguration().inflate( xml );
                    responder.result( config );
                })
                .fail( responder.fault );
        };

        /**
         * Makes request for predictions of stop on MassDOT service.
         * @param  {String} routeTag The tag property value of the target Route.
         * @param  {String} stopTag The tag propert value of the target Stop.
         * @param  {Object} responder Response delegate
         */
        function _getPredictions( routeTag, stopTag, responder ) {
            $.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=mbta&r=" + routeTag + "&s=" + stopTag )
                .done( function( xml ) {
                    var predictions = [];
                    $(xml).find('prediction').each( function() {
                        predictions.push( new massroute.model.StopPrediction().inflate( this ) );
                    });
                    responder.result( predictions );
                })
                .fail( responder.fault );
        }
        
        return {
            getRoutes: function( responder ) {
                console.log( "[massroute.service.Service]::getRoutes()");
                _queue.add( _getRoutes, responder );
            },
            getConfig: function( routeTag, responder ) {
                console.log( "[massroute.service.Service]::getConfig() for " + routeTag );  
                _queue.add( _getConfig, routeTag, responder );
            },
            getPredictions: function( routeTag, stopTag, responder ) {
                console.log( "[massroute.service.Service]::getPredictions() for " + stopTag + " along route " + routeTag ); 
                _queue.add( _getPredictions, routeTag, stopTag, responder );
            }
        }
    });
    
    window.massroute.service.Service = Service;
    
})( jQuery );