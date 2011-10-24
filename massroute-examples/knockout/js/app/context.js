(function() {
    
    // Namespace for app.
    window["massroute"] = window.massroute || {};
    window.massroute["context"] = window.massroute.context || {};
    
    /**
     * Control serves as a proxy between a client and the service, updating session model from response before sending result/fault on its way to passed delegate.
     * @param  {massroute.service.Service} service The Service implementation to use in making requests to MassDot.
     * @param  {massroute.model.Session} session The Session model state to update on response from service.
     * @return {Control}
     */
    var Control = (function( service, session ) {
        var _service = service;
        var _session = session;
        return {
          /**
           * Makes request for routes on Service instance and updates Session model state.
           * @param  {Object} responder The responder deleagte to invoke on result/fault.
           */
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
          /**
           * Makes request for destinations on Service instance and updates Session model state.
           * @param  {String} routeTag The target Route tag value.
           * @param  {Object} responder The responder delegate to invoke on result/fault.
           */
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
          /**
           * Makes request for stops on Service instance and updates Session model state.
           * @param  {massroute.model.RouteDestionation} destination The selected and target RouteDestionation to find stops along.
           * @param  {Object} responder The responder delegate to invoke on result/fault.
           */
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
          /**
           * Makes request for predictions on Service instance.
           * @param  {massroute.model.RouteStop} stop The selected and target RouteStop to request predictions on.
           * @param  {Object} responder The reponder delegate to invoke on result/fault.
           */
          getPredictions: function( stop, responder ) {
            _service.getPredictions( _session.selectedRoute, stop.tag, responder );
          }
        }
    });
    
    /**
     * Context serves as the 'smart-ly' wired context for the app that manages relation of request to state.
     * @return {massroute.context.Context}
     */
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