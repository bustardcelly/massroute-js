// $ = xhr library.
(function( $ ) {
    
    // Namespace for app.
    window["massroute"] = window.massroute || {};
    window.massroute["service"] = window.massroute.service || {};
    
    // (function) denotes that This Revealing Module/Constructor should be used as a class.
    var ServiceQueue = (function() {
        
    });
    
    // (function) denotes that This Revealing Module/Constructor should be used as a class.
    var Service = (function() {
        var _queue = new ServiceQueue();
        
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

        function _getConfig( routeTag, responder ) {
            $.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=mbta&r=" + routeTag )
                .done( function( xml ) {
                    var config = new massroute.model.RouteConfiguration().inflate( xml );
                    responder.result( config );
                })
                .fail( responder.fault );
        };

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
                _getRoutes( responder );
            },
            getConfig: function( routeTag, responder ) {
                console.log( "[massroute.service.Service]::getConfig() for " + routeTag );  
                _getConfig( routeTag, responder );
            },
            getPredictions: function( routeTag, stopTag, responder ) {
                console.log( "[massroute.service.Service]::getPredictions() for " + stopTag + " along route " + routeTag ); 
                _getPredictions( routeTag, stopTag, responder );
            }
        }
    });
    
    window.massroute.service.Service = Service;
    
})( jQuery );