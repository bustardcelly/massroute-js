(function( $, ko ) {
    
    // Application Context.
    var context = new massroute.context.Context();

    /** Knockout view models. **/
    // -- Routes --
    var routes = {
        title: 'Routes',
        visible: ko.observable(false),
        list: ko.observableArray(),
        selectedItem: ko.observable('')
    };
    routes.select = function( route ) {
        routes.selectedItem( route.tag );
        changeState( model.currentState(), 1 );
    };

    // -- Destinations --
    var destinations = {
        title: 'Destinations',
        visible: ko.observable(false),
        inbound: ko.observableArray(),
        outbound: ko.observableArray(),
        selectedItem: ko.observable(undefined)
    };
    destinations.select = function( destination ) {
        destinations.selectedItem( destination );
        changeState( model.currentState(), 1 );
    };

    // -- Stops --
    var stops = {
        title: 'Stops',
        visible: ko.observable(false),
        list: ko.observableArray(),
        selectedItem: ko.observable(undefined)
    };
    stops.select = function( stop ) {
        stops.selectedItem( stop );
        changeState( model.currentState(), 1 );
    }

    var predictions = {
        title: 'Predictions',
        visible: ko.observable(false),
        list: ko.observableArray()
    }

    // -- KO --
    var model = {
        title: 'MassRoute',
        states: ['routes', 'destinations', 'stops', 'predictions'],
        currentState: ko.observable('idle'),
        history: ko.observableArray(),
        routes: routes,
        destinations: destinations,
        stops: stops,
        predictions: predictions
    };

    // State changewatcher.
    model.currentState.subscribe( function( newValue ) {
        console.info( "state update: " + newValue );
        switch( newValue ) {
            case "routes":
            // TODO: Move to controllers. activate()/deactivate()
                $('.route-item').live( 'click', function( event ) {
                    event.preventDefault();
                    model.routes.select( ko.dataFor( this ) ); 
                    return false;
                });
                context.control.getRoutes( {
                    result: function( response ) {
                        model.routes.list( context.session.routes );
                   },
                   fault: function( error ) {
                        throw error;
                   }
                });
                break;
            case "destinations":
                $('.destination-item').live( 'click', function( event ) {
                    event.preventDefault();
                    model.destinations.select( ko.dataFor( this ) );
                    return false;
                });
                context.control.getDestinations( ko.utils.unwrapObservable(routes.selectedItem() ), {
                    result: function( response ) {
                        var configuration = response;
                        var destinations = configuration.destinations;
                        model.destinations.inbound( $.grep( destinations, function( item ) {
                            return item.name === 'Inbound';   
                        }) );
                        model.destinations.outbound( $.grep( destinations, function( item ) {
                            return item.name === 'Outbound';  
                        }) );
                    },
                    fault: function( error ) {
                        throw error;
                    }
                });
                break;
            case "stops":
                $('.stop-item').live( 'click', function( event ) {
                    event.preventDefault();
                    model.stops.select( ko.dataFor( this ) );
                    return false;
                });
                context.control.getStops( ko.utils.unwrapObservable( destinations.selectedItem() ), {
                   result: function( response ) {
                        model.stops.list( response );
                   },
                   fault: function( error ) {
                       throw error;
                   }
                });
                break;
            case "predictions":
                $('.refresh-button').bind( 'click', function( event ) {
                    getPredictions();
                });
                getPredictions();
                break;
        }
        model[newValue].visible(true);
    });

    function getPredictions() {
        context.control.getPredictions( ko.utils.unwrapObservable( stops.selectedItem() ), {
           result: function( response ) {
                // TODO: if response is empty, show 'No Predictions'
               console.debug( "predictions: " + response );
               model.predictions.list( $.map( response, function( item ) {
                   return {title:item.minutes + ' minute(s)'};
               }) );
           },
           fault: function( error ) {
               throw error;
           }
        });
    }

    // State controller.
    function changeState( fromState, direction ) {
        var index = model.states.indexOf( fromState ),
            newIndex = index + direction,
            newState;
        
        if( newIndex > -1 && newIndex < model.states.length ) {
            newState = model.states[newIndex];
            console.log( "changeState- from: " + model.currentState() + ", " + index + ", to: " + newState + ", " + newIndex );

            if( model.hasOwnProperty( model.currentState() ) ) {
                model[model.currentState()].visible(false);    
            }

            model.currentState( newState );
            if( direction == 1 ) {
                model.history.push( newState );
            }
            else if( direction == -1 ) {
                model.history.pop();
            }
            console.log( "history: " + Array.prototype.slice.call( model.history() ).join( ', ') );
        }
    }

    // Ready handler.
    function handleReady() {
        
        // Apply bindings.
        ko.applyBindings( model );
        // Kick off.
        changeState( model.currentState(), 1 );
        
        // All previous buttons will just pop history.
        $('.previous-button').live('click', function() {
            event.preventDefault();
            changeState( model.currentState(), -1 );
            return false; 
        });
    }
    
    $().ready( handleReady );
    
})( jQuery, ko );