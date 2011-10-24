(function( $, ko ) {
    
    // Namespace for app.
    window["massroute"] = window.massroute || {};
    window.massroute["controller"] = window.massroute.controller || {};

    /**
     * UIController serves as the mediator for view action based on state.
     * @param  {Object} viewModel The knockout viewmodel.
     * @return {UIController}
     */
    var UIController = (function( viewModel ) {

        var viewModel = viewModel;

        /**
         * Event handler for selection on route list item.
         */
        function _selectRoute( event ) {
            event.preventDefault();
            viewModel.routes.select( ko.dataFor( this ) ); 
            return false;
        }
        
        /**
         * Event handler for selection on destination list item.
         */
        function _selectDestination( event ) {
            event.preventDefault();
            viewModel.destinations.select( ko.dataFor( this ) );
            return false;
        }
        
        /**
         * Event handler for selection on stop list item.
         **/
        function _selectStop( event ) {
            event.preventDefault();
            viewModel.stops.select( ko.dataFor( this ) );
            return false;
        }

        /**
         * Event handler on view model change to current state.
         * @param  {String} value The current state on the view model.
         */
        function _handleCurrentChange( value ) {
            switch( value ) {
                case 'routes':
                    $('.route-item').live( 'click', _selectRoute );
                    if( viewModel.previousState() === 'destinations' ) {
                        viewModel.destinations.clear();
                    }
                    break;
                case 'destinations':
                    $('.destination-item').live( 'click', _selectDestination );
                    if( viewModel.previousState() === 'stops' ) {
                        viewModel.stops.clear();
                    }
                    break;
                case 'stops':
                    $('.stop-item').live( 'click', _selectStop );
                    if( viewModel.previousState() === 'predictions' ) {
                        viewModel.predictions.clear();
                    }
                    break;
                case 'predictions':
                    break;
            }
        }

        /**
         * Event handler on view model change to previous state.
         * @param  {String} value The previous state on the view model.
         */
        function _handlePreviousChange( value ) {
            switch( value ) {
                case 'routes':
                    $('.route-item').die( 'click', _selectRoute );
                    break;
                case 'destinations':
                    $('.destination-item').die( 'click', _selectDestination );
                    break;
                case 'stops':
                    $('.stop-item').die( 'click', _selectStop );
                    break;
                case 'predictions':
                    break;
            }
        }

        return {
            updateOnCurrent: _handleCurrentChange,
            updateOnPrevious: _handlePreviousChange
        } 
    });

    /**
     * AppController is the main mediator on the view that manages actions and delegates coerrsponding requests.
     * @param  {Object} viewModel The knockout view model.
     * @param  {massroute.context.Context} context The application context on which to make requests.
     * @return {massroute.controller.AppController}
     */
    var AppController = (function( viewModel, context ) {

        var uiController = new UIController( viewModel );
        var stateCommands = {
            'routes' : _getRoutes,
            'destinations' : _getDestinations,
            'stops' : _getStops,
            'predictions' : _getPredictions
        }

        /**
         * Subscribe to change in previous state on view model.
         */
        viewModel.previousState.subscribe( function( newValue ) {
            uiController.updateOnPrevious( newValue );
            if( viewModel.hasOwnProperty( newValue ) ) {
                viewModel[newValue].visible(false);   
            }
        });

        /**
         * Subscribe to change in current state on view model.
         */
        viewModel.currentState.subscribe( function( newValue ) {
            uiController.updateOnCurrent( newValue );
            stateCommands[newValue].call( this );
            viewModel[newValue].visible(true);
        });

        /**
         * Requests the list of routes based on view model properties.
         */
        function _getRoutes() {
            context.control.getRoutes( {
                result: function( response ) {
                    viewModel.routes.list( context.session.routes );
                },
                fault: function( error ) {
                    throw error;
                }
            });
        }

        /**
         * Requests the list of destinations based on view model properties.
         */
        function _getDestinations() {
            context.control.getDestinations( ko.utils.unwrapObservable(viewModel.routes.selectedItem() ), {
                result: function( response ) {
                    var configuration = response;
                    var destinations = configuration.destinations;
                    viewModel.destinations.inbound( $.grep( destinations, function( item ) {
                        return item.name === 'Inbound';   
                    }) );
                    viewModel.destinations.outbound( $.grep( destinations, function( item ) {
                        return item.name === 'Outbound';  
                    }) );
                },
                fault: function( error ) {
                    throw error;
                }
            });
        }

        /**
         * Requests the list of stops based on view model properties.
         */
        function _getStops() {
            context.control.getStops( ko.utils.unwrapObservable( viewModel.destinations.selectedItem() ), {
               result: function( response ) {
                    viewModel.stops.list( response );
               },
               fault: function( error ) {
                   throw error;
               }
            });
        }

        /**
         * Requests the list of predictions based on view model properties.
         */
        function _getPredictions() {
            context.control.getPredictions( ko.utils.unwrapObservable( viewModel.stops.selectedItem() ), {
               result: function( response ) {
                    if( response.length === 0 ) {
                        response.push( {title: 'No predictions at this time.'} );
                        viewModel.predictions.list( response );
                    }
                    else
                    {
                        viewModel.predictions.list( $.map( response, function( item ) {
                            return {title:item.minutes + ' minute(s)'};
                        }) );
                    }
               },
               fault: function( error ) {
                   throw error;
               }
            });
        }

        /**
         * Manages changing the current state on the view model based on direction.
         * @param  {String} fromState The state from which to move in direction.
         * @param  {Number} direction The direction in which to move state. Either 1 or -1.
         */
        function _changeState( fromState, direction ) {
            var index = viewModel.states.indexOf( fromState ),
                newIndex = index + direction,
                newState;
            
            if( newIndex > -1 && newIndex < viewModel.states.length ) {

                newState = viewModel.states[newIndex];
                viewModel.previousState( viewModel.currentState() );
                viewModel.currentState( newState );
                
                if( direction == 1 ) {
                    viewModel.history.push( newState );
                }
                else if( direction == -1 ) {
                    viewModel.history.pop();
                }
            }
        }

        /**
         * Initializes the controller and wires any UI respondants.
         */
        function _initialize() {
             // All previous buttons will just pop history.
            $('.previous-button').live('click', function( event ) {
                event.preventDefault();
                _changeState( viewModel.currentState(), -1 );
                return false; 
            });
            // Refresh button will update predictions.
            $('.refresh-button').live( 'click', function( event ) {
                event.preventDefault();
                _getPredictions();
                return false;
            });
            // Kick off.
            _changeState( viewModel.currentState(), 1 );
        }

        return {
            init: _initialize,
            changeState: _changeState
        }
    });
    
    window.massroute.controller.AppController = AppController;

})( jQuery, ko );