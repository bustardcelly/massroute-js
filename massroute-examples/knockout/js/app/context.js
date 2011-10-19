(function() {
    
    // Namespace for app.
    window["massroute"] = window.massroute || {};
    window.massroute["context"] = window.massroute.context || {};
    
    var Control = (function( service, session ) {
        var _service = service;
        var _session = session;
        return {
            getRoutes: function( responder ) {
              // Try to access from session cache.
              if( typeof _session.routes != 'undefined' ) {
                responder.result.call( responder.result, _session.routes );
              }
              // Else go out.
              else {
                _service.getRoutes( {
                  result: function( response ) {
                      _session.routes = response;
                      if( responder ) {
                          responder.result.call( responder.result, response );
                      }
                  },
                  fault: responder.fault || function( error ) {
                      throw "Error in loading request for Service.getRoutes() - " + error;
                  }
                });
              }
            },
            getDestinations: function( routeTag, responder ) {
              _session.selectedRoute = routeTag;
              // Try to access previously loaded configuration from session cache.
              if( _session.configurationCache.hasOwnProperty( routeTag ) ) {
                responder.result.call( responder.result, _session.configurationCache[routeTag] );
              }
              // Else go out.
              else {
                _service.getConfig( routeTag, {
                  result: function( response ) {
                    _session.configurationCache[routeTag] = response;
                    if( responder ) {
                      responder.result.call( responder.result, response );
                    }
                  },
                  fault: responder.fault || function( error ) {
                    throw "Error in requsting configuration for Service.getConfig() on " + routeTag + ". - " + error;
                  }
                });
              }
            },
            getStops: function( destination, responder ) {
              var configuration = _session.configurationCache[_session.selectedRoute],
                  errorMessage = "Could not find configuration for Route " + _session.selectedRoute + ". Required to find stops along route from Service.getStops().";
              if( typeof configuration != 'undefined' ) {
                responder.result.call( responder.result, configuration.stopsForDestination( destination ) );
              }
              else {
                if( responder.hasOwnProperty( 'fault' ) ) {
                  responder.fault.call( responder.fault, errorMessage );
                }
                else {
                  throw errorMessage;
                }
              }
            },
            getPredictions: function( stop, responder ) {
              _service.getPredictions( _session.selectedRoute, stop.tag, responder );
            }
        }
    });
    
    var Context = (function() {
       var _session = new massroute.model.Session();
       var _service = new massroute.service.Service();
       var _control = new Control( _service, _session );
       return {
            session: _session,
            service: _service,
            control: _control
       }
    });
    
    window.massroute.context.Context = Context;
    
})();